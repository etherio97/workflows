const { default: axios } = require("axios");
const Job = require('./Job');
const ENDPOINT_URL = process.env.ENDPOINT_URL ||
  "https://workflows-test-13c0a-default-rtdb.firebaseio.com/logs.json";

!function start() {
  const job = new Job(process.env);

  // store to database
  axios.post(ENDPOINT_URL, job)
    .then(({ data }) => {
      //
    }).catch((e) => {
      console.error(e, '-'.repeat(60));
      console.log(">> Database connection failed!", e.message);
    });
}();
