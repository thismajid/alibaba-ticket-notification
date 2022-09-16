const express = require("express");
const axios = require("axios");
const readline = require("readline-sync");
const moment = require("moment");

const app = express();

const getRequestIdUrl =
  "https://ws.alibaba.ir/api/v1/flights/domestic/available";
const getFlightInfoUrl =
  "https://ws.alibaba.ir/api/v1/flights/domestic/available";

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is started on localhost:${port} ...`);
});

const getInput = (text) => readline.question(text);

const main = async () => {
  try {
    const { data: firstReq } = await axios.post(getRequestIdUrl, {
      origin: "THR",
      destination: "TBZ",
      departureDate: "2022-09-18",
      adult: 1,
      child: 0,
      infant: 0,
    });
    console.log(firstReq);
    setTimeout(async () => {
      const { data: secondReq } = await axios.get(
        `${getFlightInfoUrl}/${firstReq?.result?.requestId}`
      );
      console.log(secondReq);
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
  const date = await getInput(
    "Enter your desired date with this format (yyyy-mm-dd) : "
  );
  if (!validationDateFormat(date)) {
    console.log("Please enter date with correct format.");
    process.exit(1);
  }
  setInterval(async () => {
    await main();
  }, 20000);
})();
