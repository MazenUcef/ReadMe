import { CronJob } from 'cron'; // Correct import
import https from 'https';

const job = new CronJob(
    "*/14 * * * *", // Every 14 minutes
    function () {

        https
            .get('http://10.0.2.2:3000', (res) => {
                if (res.statusCode === 200) {
                    console.log("GET request sent successfully");
                } else {
                    console.log("GET request failed", res.statusCode);
                }
            })
            .on("error", (e) => {
                console.error("Error while sending request", e);
            });
    },
    null, // onComplete (optional)
    true, // start immediately
    'UTC' // timezone (optional)
);

export default job;