const { Pool, Client } = require('pg');
const dbConnection = require('./dbConnection');
const variables = require('./postgresVariables');
const pg = require('pg-promise')()
const connectionString = "postgresql://"+variables.user+":"+variables.password+"@"+variables.host+":"+variables.port+"/"+variables.database+"?ssl=true";


const db = pg(connectionString)

module.exports = db;

