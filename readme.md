# API Engineering.

## The repository demonstrates the working mechanism of the APIs using a movie booking application. It includes the standard partices such as naming conventions and the functionalites which are supposed to be associated with the api.

## The repository talks about following functionalities.

1. Role based Access Control and Route Protection.
2. Exchange of the data using path params, query params and request/response body.
3. Pagination.
4. Filtering.
5. Idempotency.
6. Rate Limiting.
7. Setting up the API Key.


## TechStack.
`Typescript`, `Express`, `MySQL`, `Sequelize ORM`

## Configuring the .env file
The `.env file` will contain following  `environment variables` :-
```
PORT=''
ACCESS_TOKEN_SECRET=''
REFRESH TOKEN_SECRET=''
```



## Installation
```
npm i 
```

## Routes

|Route                          | Method        | Description                       |
|:------------------------------|:--------------|:----------------------------------|
|/api/v1/auth/signup            |POST           |Register a new user                |
|/api/v1/auth/signin            |POST           |Login yourself                             |
|/api/v1/auth/signout           |POST           |LogOut yourself                            |
