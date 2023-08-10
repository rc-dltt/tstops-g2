# telemetry

```bash
docker compose up
```


Login to grafana 
username: admin
password: admin


Add prometheus datasource.
Because it's running from docker compose, use http://promotheus:9090 as url (not localhost)


Run k6 tests and see the data flowing from prometheus to grafana dashboard

```bash
k6 run script.js
    -e TARGET_URL="http://localhost:4001/graphql" \
    --out experimental-prometheus-rw \
    --tag testid="1234"
```

