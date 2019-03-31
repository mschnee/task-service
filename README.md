# task-service

## Getting Started

Dependencies:

-   [docker](https://www.docker.com/get-started)
-   [NodeJS](https://nodejs.org)
-   `npm run install`

# Testing

## Run the integration tests

```
npm run it
```

## Startup and teardown docker for manual test debugging

The up/down steps ensure that the volumes are removed so that
future tests are sane.

```
docker-compose -f docker-compose.test.yml up -d
# run your manual testing now
docker-compose -f docker-compose.test.yml down -v
```
