const express = require("express");
const axios = require("axios");
const readline = require("readline-sync");

const app = express();

const getRequestIdUrl =
  "https://ws.alibaba.ir/api/v1/flights/domestic/available";
const getFlightInfoUrl =
  "https://ws.alibaba.ir/api/v1/flights/domestic/available";

(async () => {})();

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

setInterval(async () => {
  await main();
}, 20000);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is started on localhost:${port} ...`);
});
