# Setting up a typescript project.
```
npm i ts-node
```

```
npm i tsx
```

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

# Setting up the database and sequelize ORM.

1. Setting up the configration for the database.

The db folder contains the models, migrations and seeders. for this pupose  '.sequerizerc' file is used.
This .sequelizerc file  is a special configuration file used by the Sequelize Command-Line Interface (CLI) to specify options and paths for managing a project's database interactions, such as migrations, models, and seeders.

2. The '.sequelizerc' file will contain following type of code.

```
const path = require('path');
module.exports = {
  config: path.resolve('src/config/db.config.cjs'),
  modelsPath: path.resolve('src/db/models'),
  migrationsPath: path.resolve('src/db/migrations'),
  seedersPath: path.resolve('src/db/seeders'),
};
```

3. Installing dependencies

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
Following are the use cases of a database driver:

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

```
npm i sequlize-cli
```
The command `npm i sequelize-cli` enables us to intract with the database using the command line interface.



## Configration used by `sequeize-cli`
```
module.exports={
    "development": {
      "username": process.env.DB_USER,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_NAME,
      "host": process.env.DB_HOST,
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": "root",
      "password": null,
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
}
```

## Whenever we run a CLI command like `npx sequelize-cli db:migrate`, internally sequelize does following
1. Detect environment by checking `process.env.NODE_ENV`, If not set then by defaults it takes it as 11 `development`

2. Picks one of the config block defined as development/test/production from the config file, whose path/location is defined as `config: path.resolve('src/config/db.config.cjs')` in the `.sequelizerc` file.
Ex-
```
module.exports = {
  development: { ... },
  test: { ... },
  production: { ... }
}
```
if sequelize finds the `process.env.NODE_ENV` as `development` then it will pick the following block.
```
"development": {
      "username": process.env.PRODUCTION_USERNAME,
      "password": process.env.PRODUCTION_PASSWORD,
      "database": process.env.PRODUCTION_DATABASE,
      "host": process.env.PRODUCTION_HOST,
      "dialect": "mysql"
    }
```


## But during the Run time, for performing the intractions between the application server and database the sequelize uses a completely different configration, which is as following 

```
import { Sequelize } from "sequelize-typescript"

const sequelize = new Sequelize({
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST!,
  dialect: "mysql",
  logging: false
});

export default sequelize;

```
Here the `Sequelize` imported from `sequelize-typescript` is nothing but the class which has predefined methods and their implementations. It provides methods like
- .authenticate()
- .sync()
- .query()
- .transaction()

And when we talk about the `sequelize`, this is nothing but the instance of the `Sequelize` class, which gets defined as following `const sequelize = new Sequelize(...)`


## Migrations, Models and Seeders

## Migrations
- A migration is a way to manage and track changes to your database schema over time. It keep track of all the changes done to the database schema, just like a version control but only for the database.

- Instead of directly modifying database tables manually, we Write changes in the migration files and then run migrations to apply those changes to the database schema, so that the database schema remains in the sync with the application.

- a migration file has following two functions that is `up()` and `down()`
- up() -> It is used to apply the changes.
- down() -> It is used to revert the specific changes that we have made for the migration.
- A migration file contains following type of code.

```
module.exports= {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Theatre', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type:'INTEGER'
      },
      name: {
        type: 'VARCHAR(255)',
        allowNull: false
      },
      address: {
        type: 'VARCHAR(255)',
        allowNull: false
      },
      rating: {
        type: 'FLOAT',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: 'DATE'
      },
      updatedAt: {
        allowNull: false,
        type: 'DATE'
      }                                          
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS  Theatre
    `)
  }
};
```

## queryInterface.sequelize.query() vs queryInterface methods

`queryInterface` 
A queryInterface works directly on the schema existing in the db, no model is needed at all when intracting with db using `queryInterface`.

1. `queryInterface.sequelize.query()`
queryInterfacesequelize.query() lets you run raw SQL queries directly.
```
await queryInterface.sequelize.query(
  "SELECT * FROM Users WHERE age > 25"
);
```

2. `queryInterface methods`
It is a high-level abstraction provided by Sequelize to modify the database schema.
```
async up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Users', 'age', {
    type: Sequelize.INTEGER,
  });
}
```

A `queryInterface` provides following methods to perform schema level db operations.
- `createTable()`
```
await queryInterface.createTable('Users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});
```
- `dropTable()`
```
await queryInterface.dropTable('Users');
```

- `renameTable()`
```
await queryInterface.renameTable('OldName', 'NewName');
```

- `addColumn()`
```
await queryInterface.addColumn('Users', 'email', {
  type: Sequelize.STRING
});
```

-`removeColumn()`
```
await queryInterface.removeColumn('Users', 'email');
```

- `changeColumn()`
```
await queryInterface.changeColumn('Users', 'name', {
  type: Sequelize.STRING,
  allowNull: false
});
```

- `renameColumn()`
```
await queryInterface.renameColumn('Users', 'name', 'fullName');
```

- `addIndex()`
```
await queryInterface.addIndex('Users', ['email']);
```

- `removeIndex()`
```
await queryInterface.removeIndex('Users', ['email']);
```

-`addConstraint()`
```
await queryInterface.addConstraint('Orders', {
  fields: ['userId'],
  type: 'foreign key',
  name: 'fk_user_order',
  references: {
    table: 'Users',
    field: 'id'
  },
  onDelete: 'CASCADE'
});
```

-`removeConstraint()`
```
await queryInterface.removeConstraint('Orders', 'fk_user_order');
```

-`bulkInsert()`
```
await queryInterface.bulkInsert('Users', [
  { name: 'John', createdAt: new Date(), updatedAt: new Date() }
]);
```
-`bulkDelete()`
```
await queryInterface.bulkDelete('Users', null, {});
```

-`bulkUpdate()`
```
await queryInterface.bulkUpdate('Users', { name: 'Updated' }, {});
```


## Models
- A model represents a table in your database. It acts like a blueprint.
- `A model is used to deal with the data associated with the table, unlike queryInterface which was getting used to deal with the schema of the database not the data`.
- A model is mainly used for performing the CRUD operations over the data associated with the Table.
- A model contains following type of code.
```
import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const User = sequelize.define("Users", {
  name: DataTypes.STRING,
  email: DataTypes.STRING
});

export default User;
```
This `User` will get used to perform the operations on the data associated with the User Table.

- create Data
```
await User.create({ 
  name: "Uttam",
  email: "uttam@gmail.com"
});
```

- read Data
```
const users = await User.findAll()
```

- updateData
```
await User.update(
  { name: "New Name" },
  { where: { id: 1 } }
);
```

- delete data
```
await User.destroy(
  { 
    where: { id: 1 } 
  }
);
```

## Seeders
Seeders are the data initially populated in the database.

## Migrations vs Models
A migration is used for making schema level changes.
A model is used for following purposes mentioned below

- Validation of the data.
```
email: {
  type: DataTypes.STRING,
  validate: { isEmail: true }
}
```
- Though the Sequelize handles the `relationship/association` defined by `joins` automatically but we can explicitely handle the associations/relationship

```
User.hasMany(Post);
Post.belongsTo(User);
```

- To deal with the triggers, it is the `model` which provide the hooks.
```
User.beforeCreate(user => {
  user.name = user.name.toUpperCase();
});
```
  

## Commands used by sequelize-cli

1. `Command to create following folders`
- models
- migrations
- seeders
- config

```
npx sequelize-cli init
```

2. `Command to create only the models folder`
```
npx sequelize-cli init:models
```

3. `Command to create only the migrations folder`
```
npx sequelize-cli init:migrations
```

4. `Command to create only the seeders folder`
```
npx sequelize-cli init:seeders
```

5. `Command to generate the model along with migration`
```
npx sequelize-cli model:generate --name User --attributes name:string,email:string
```

6. `Command to Generate only migration`
```
npx sequelize-cli migration:generate --name create-users-table
```

7. `Command to run all migrations`
```
npx sequelize-cli db:migrate
```

8. `Command to undo the last migration`
```
npx sequelize-cli db:migrate:undo
```

9. `Commandd to undo all the migrations`
```
npx sequelize-cli db:migrate:undo:all
```

10. `Command to check the migration status`
```
npx sequelize-cli db:migrate:status
```

