import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: "constant-arrival-rate",
      duration: "10s",
      rate: 30,
      timeUnit: "1s",
      preAllocatedVUs: 50,
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
};

// const endpointUrl = "http://localhost:4001/graphql";
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

  if (response.status === 200) {
    console.log(JSON.stringify(response.body));
    const body = JSON.parse(response.body);
  }

  sleep(1);
}
