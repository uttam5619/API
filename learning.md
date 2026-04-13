# Setting up a typescript project.
```
npm i typescript
```

```
npx tsc --init
```
This command initialize the typescript config file like shown below.
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

# Setting up the database and sequlite ORM.

1. Setting up the configration for the database.

The db folder contains the models, migrations and seeders. for this pupose  '.sequerizerc' file is used.
This .sequelizerc file  is a special configuration file used by the Sequelize Command-Line Interface (CLI) to specify options and paths for managing a project's database interactions, such as migrations, models, and seeders.

1. The '.sequelizerc' file will contain following type of code.

```
const path = require('path');
module.exports = {
  config: path.resolve('src/config/db.config.cjs'),
  modelsPath: path.resolve('src/db/models'),
  migrationsPath: path.resolve('src/db/migrations'),
  seedersPath: path.resolve('src/db/seeders'),
};
```

2. Installing dependencies

```
npm i sequelize
```
This command `npm i sequelize` helps to install the sequelize ORM library, which provies the ORM specific functionalities.

```
npm install mysql2
```
The command `npm install mysql2` helps to install the database specific driver library. A database driver (also called a driver library, connector, or client library) is a software component that acts as a bridge between your application code and a specific database management system (DBMS), such as MySQL, PostgreSQL, Oracle, MongoDB, etc. 

The primary purpose of a database driver library is to enable your application to communicate with the database in a standardized, efficient, and secure way.

# Key Functions of the driver library.
Foolowing are the use cases of a database driver:

1. Establishing and Managing Connections`
`Handles connection strings, authentication (username/password, SSL, tokens), and pooling (reusing connections for performance)`.
`Supports features like timeouts, retries, and failover`.

2. Executing Queries and Statements
`Sends SQL (or NoSQL commands) to the database.`
`Handles prepared statements (for security against SQL injection) and parameterized queries.`
`Processes results (rows, metadata, errors).`

3. Data Type Conversion
`Translates data between the database's format and your programming language (e.g., database TIMESTAMP → language DateTime object).`

4. Transaction Management
`Supports BEGIN, COMMIT, ROLLBACK for atomic operations.`

5. Vendor-Specific Optimizations
`Many drivers add features like bulk inserts, streaming results, or database-specific extensions while still providing a standard interface.`

# npm i sequlize-cli
The command `npm i sequelize-cli` enables us to intract with the database using the command line interface.

