# Api

## Idempotency in API.
Idempotency ensures that repeating the same request multiple times has the same effect as doing it once. This is crucial for reliability, especially with network retries, timeouts, or distributed systems.

## Idempotency in HTTP Methods.
Some of the http methods are naturally idempotent. `GET`, `PUT` and `DELETE` are naturally idempotent in nature, whereas `POST` and `PATCH` are not idempotent by default.
