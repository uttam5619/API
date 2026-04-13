# Setting up a typescript project.
```npm i typescript```

```npx tsc --init```
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

1. Setting up the database.

The db folder contains the models, migrations and seeders. for this pupose  '.sequerizerc' file is used.
This .sequelizerc file  is a special configuration file used by the Sequelize Command-Line Interface (CLI) to specify options and paths for managing a project's database interactions, such as migrations, models, and seeders.

# The '.sequelizerc' file will contain following type of code.

```
const path = require('path');
module.exports = {
  config: path.resolve('src/config/db.config.cjs'),
  modelsPath: path.resolve('src/db/models'),
  migrationsPath: path.resolve('src/db/migrations'),
  seedersPath: path.resolve('src/db/seeders'),
};
```