# CSBudget API

The CSBudget API is a back-end API built with Node.js and Express that queries a PostgreSQL database via Knex.js.

## Run locally

1. Having Node.js and npm installed is a prerequisite for running the project locally. The npm Docs offer download and installation instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) or download the project and open the project directory in your shell of choice.
3. Install dependencies with command `npm install`.
4. Run the application with script `npm start`. The server will be hosted locally at [localhost:3001](http://localhost:3001).
5. Open your PostgreSQL terminal in the project directory and run command `\include tables.sql`. (Alternatively, run the commands in [tables.sql](https://github.com/christopherstraub/csbudget-api/blob/master/tables.sql) in your terminal/GUI.)
6. Update the `configDev` object in [knex-instance.js](https://github.com/christopherstraub/csbudget-api/blob/master/knex-instance.js) with your credentials.

## Dependencies

- bcryptjs
- cors
- express
- knex
- pg

### Dev dependencies

- nodemon

## License

The CSBudget API is [MIT licensed](https://github.com/christopherstraub/csbudget-api/blob/master/LICENSE).
