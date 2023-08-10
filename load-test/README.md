# Performance tests with k6

start the server from the `race` folder 

```bash
npm start
```

To point to the HKJC sandbox environment pass the k6 argument
`-e TARGET_URL=<url>`


## load test

run load test 

```bash
k6 run load-test.js \
    -e TARGET_URL=http://localhost:4001/graphql
```