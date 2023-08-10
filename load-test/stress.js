import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    stress_stages: {
      executor: "ramping-arrival-rate",
      timeUnit: "1s",
      preAllocatedVUs: 250,
      stages: [
        { target: 500, duration: "30s" },
        { target: 1000, duration: "30s" },
        { target: 1500, duration: "1m" }, // stress load
        { target: 0, duration: "30s" },
      ],
    },
    stress: {
      executor: "constant-arrival-rate",
      preAllocatedVUs: 500,
      rate: 1500, // stress load
      timeUnit: "1m",
      duration: "3m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"], // http errors should be less than 5%
    http_req_duration: ["p(90)<400"], // 90% of requests should be below 400ms
  },
};

const endpointUrl = __ENV.TARGET_URL;

const query = `
  query GetHorses {
    horses {
      id
      name
      rank
      race {
        id
        no
        startTime
        venue
      }
    }
  }
`;

const headers = {
  "Content-Type": "application/json",
};

export default function () {
  const response = http.post(
    endpointUrl,
    JSON.stringify({
      query: query,
    }),
    { headers: headers }
  );
  check(response, { "status is 200": (r) => r.status === 200 });
  sleep(1);
}
