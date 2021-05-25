const ENDPOINT_URL = "https://workflows-test-13c0a-default-rtdb.firebaseio.com/logs.json";
const { default: axios } = require("axios");

console.log("[JOB] STARTED: ", new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Yangon',
}));

axios.post(ENDPOINT_URL, {
  ...env,
  createdAt: Date.now(),
}).then(({ data }) => {
  console.log('[JOB] STORED: ', data);
}).catch((e) => {
  console.error(e, e.response?.data || e.message, e.headers);
  console.log("[JOB] FAILED: ", e.message);
}).finally(() => {
  console.log("[JOB] ENDED: ", new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Yangon',
  }));
});;
