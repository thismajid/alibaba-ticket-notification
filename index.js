const express = require("express");
const axios = require("axios");

const app = express();

const main = async () => {
  try {
    const { data: firstReq } = await axios.post(
      "https://ws.alibaba.ir/api/v1/flights/domestic/available",
      {
        origin: "THR",
        destination: "TBZ",
        departureDate: "2022-09-18",
        adult: 1,
        child: 0,
        infant: 0,
      }
    );
    console.log(firstReq);
    setTimeout(async () => {
      const { data: secondReq } = await axios.get(
        `https://ws.alibaba.ir/api/v1/flights/domestic/available/${firstReq?.result?.requestId}`
      );
      console.log(secondReq);
    }, 5000);
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
