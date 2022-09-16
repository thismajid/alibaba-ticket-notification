const express = require("express");
const axios = require("axios");
const readline = require("readline-sync");
const moment = require("moment");
const chalk = require("chalk");

const { logger } = require("./tools");

const app = express();

const getRequestIdUrl =
  "https://ws.alibaba.ir/api/v1/flights/domestic/available";
const getFlightInfoUrl =
  "https://ws.alibaba.ir/api/v1/flights/domestic/available";

const port = process.env.PORT || 8080;

app.listen(port, () =>
  logger(`Server is started on localhost:${port} ...`, "green")
);

const getInput = (text, color) => {
  switch (color) {
    case "red":
      return readline.question(chalk.red(text));
    case "blue":
      return readline.question(chalk.blue(text));
  }
};

const main = async (body) => {
  try {
    const { data: firstReq } = await axios.post(getRequestIdUrl, body);
    logger(firstReq, "green");
    setTimeout(async () => {
      const { data: secondReq } = await axios.get(
        `${getFlightInfoUrl}/${firstReq?.result?.requestId}`
      );
      logger(secondReq, "blue");
    }, 2500);
  } catch (e) {
    console.log(e);
  }
};

const validationDateFormat = (date) => {
  const dateFormat = "YYYY-MM-DD";
  const toDateFormat = moment(new Date(date)).format(dateFormat);
  return moment(toDateFormat, dateFormat, true).isValid();
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
  console.log(chalk.green("Well done. please wait to get results ..."));
  setInterval(async () => {
    await main(body);
  }, 20000);
})();
