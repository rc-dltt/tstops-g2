import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    load_stages: {
      executor: "ramping-arrival-rate",
      timeUnit: "1s",
      preAllocatedVUs: 50,
      stages: [
        { target: 250, duration: "30s" },
        { target: 250, duration: "1m" }, // average load
        { target: 0, duration: "30s" },
      ],
    },
    load: {
      executor: "constant-arrival-rate",
      rate: 250,
      timeUnit: "1m",
      preAllocatedVUs: 50,
      duration: "3m"
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
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
