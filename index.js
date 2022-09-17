const express = require("express");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const axios = require("axios");

const { logger, getInput, validationDateFormat } = require("./tools");

const app = express();
let sentry;

const getFlightInfoUrl =
  "https://ws.alibaba.ir/api/v1/flights/domestic/available";

const port = process.env.PORT || 8080;

app.listen(port, () =>
  logger(`Server is started on localhost:${port} ...`, "green")
);

const main = async (body) => {
  try {
    const { data: firstReq } = await axios.post(getFlightInfoUrl, body);
    setTimeout(async () => {
      const { data: secondReq } = await axios.get(
        `${getFlightInfoUrl}/${firstReq?.result?.requestId}`
      );
      for (const res of secondReq.result.departing) {
        const message = `مبدا: ${res.originName} \n مقصد: ${res.destinationName}
         \n شرکت هواپیمایی: ${res.airlineName} \n کلاس پرواز: ${res.classTypeName}  
         \n نوع هواپیما: ${res.aircraft} \n تعداد صندلی باقی‌مانده: ${res.seat}`;
        const embed = new MessageBuilder()
          .setTitle("Ticket alert")
          .setColor("#00b0f4")
          .setDescription(message);
        sentry.send(embed);
        logger("message sent", "green");
      }
    }, 2500);
  } catch (e) {
    logger(e, "yellow");
  }
};

(async () => {
  const departureDate = await getInput(
    "Enter your desired date with this format (yyyy-mm-dd) : ",
    "red"
  );
  if (!validationDateFormat(departureDate)) {
    logger("Please enter date with correct format.", "red");
    process.exit(1);
  }
  const origin = await getInput("Enter your origin : ", "red");
  if (!origin) {
    logger("Please enter your origin", "red");
    process.exit(1);
  }
  const destination = await getInput("Enter your destination : ", "red");
  if (!destination) {
    logger("Please enter your destination", "red");
    process.exit(1);
  }
  const adult =
    +(await getInput("Enter your adult count (optional) : ", "blue")) || 1;
  const child =
    +(await getInput("Enter your child count (optional) : ", "blue")) || 0;
  const infant =
    +(await getInput("Enter your infant count (optional) : ", "blue")) || 0;
  const body = {
    origin,
    destination,
    departureDate,
    adult,
    child,
    infant,
  };
  const discordWebhook = await getInput(
    "Enter your discord webhook URL : ",
    "red"
  );
  sentry = new Webhook(discordWebhook);
  logger("Well done. please wait to get results ...", "green");
  setInterval(async () => {
    await main(body);
  }, 20000);
})();
