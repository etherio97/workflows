const ENDPOINT_URL = "https://workflows-test-13c0a-default-rtdb.firebaseio.com/logs.json";
const { default: axios } = require("axios");

console.log("[JOB] STARTED: ", new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Yangon',
}));

const {
  GITHUB_ACTION,
  GITHUB_EVENT_NAME,
  GITHUB_JOB,
  GITHUB_RUN_ID: 
  GITHUB_RUN_NUMBER,
  GITHUB_SHA,
  GITHUB_WORKFLOW,
  RUNNER_TRACKING_ID
} = process.env;

axios.post(ENDPOINT_URL, {
  GITHUB_ACTION,
  GITHUB_EVENT_NAME,
  GITHUB_JOB,
  GITHUB_RUN_ID,
  GITHUB_RUN_NUMBER,
  GITHUB_SHA,
  GITHUB_WORKFLOW,
  RUNNER_TRACKING_ID,
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
