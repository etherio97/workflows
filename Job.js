class Job {
    constructor({
        key,
        GITHUB_EVENT_NAME,
        GITHUB_JOB,
        GITHUB_RUN_ID,
        GITHUB_RUN_NUMBER,
        GITHUB_SHA,
        GITHUB_WORKFLOW,
        createdAt
    }) {
        Object.defineProperty(this, 'key', {
            enumerable: false,
            set(v) {
                key = v;
            },
            get() {
                return key;
            }
        });
        this.GITHUB_EVENT_NAME = GITHUB_EVENT_NAME;
        this.GITHUB_JOB = GITHUB_JOB;
        this.GITHUB_RUN_NUMBER = GITHUB_RUN_NUMBER;
        this.GITHUB_RUN_ID = GITHUB_RUN_ID;
        this.GITHUB_SHA = GITHUB_SHA;
        this.GITHUB_WORKFLOW = GITHUB_WORKFLOW;
        this.createdAt = new Date(createdAt || Date.now());
    }
}


module.exports = Job;
