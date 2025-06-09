import dotenv from "dotenv"
import pg from "pg"
import { Sequelize } from "sequelize"

dotenv.config() // To configure the dotenv file to app

const DB_NAME = process.env.DATABASE_NAME
const DB_USER_NAME = process.env.DATABASE_USER_NAME
const DB_USER_PASSWORD = process.env.DATABASE_USER_PASSWORD
const DB_HOST_NAME = process.env.DATABASE_HOST_NAME
const DB_PORT_NO = parseInt(process.env.DATABASE_PORT_NO, 10)

const dialectGroup = {
  3306: "mysql", // MySQL & MariaDB both runs same PORT
  5432: "postgres", // PostgreSQL for utkash98146
  // 5433: "postgres", // PostgreSQL for Acrto3Hil3
  1433: "mssql", // Microsoft SQL Server
  1521: "oracle", // Oracle
  50000: "db2", // IBM DB2
}

const dialect = dialectGroup[DB_PORT_NO] // set the dialect for db

// console.log(`the type of dialect is ${typeof (DB_PORT_NO)} and the PORT no is: ${DB_PORT_NO}`);

// Create a PostgreSQL client to check if database exists
async function createDatabaseIfNotExists() {
  const client = new pg.Client({
    user: DB_USER_NAME,
    password: DB_USER_PASSWORD,
    host: DB_HOST_NAME,
    port: DB_PORT_NO,
    database: process.env.DB_NAME, // Connect to default postgres database first
    dialect: dialect,
  })

  try {
    await client.connect() // to connect with db
    const query = `SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'` // sql query to check the db exists or not
    const result = await client.query(query)

    if (result.rowCount === 0) {
      // count the no of result if 0 then create db
      await client.query(`CREATE DATABASE "${DB_NAME}"`) // sql query to create the db
      console.log(`Database ${DB_NAME} created successfully.`)
    } else {
      console.log(`Database ${DB_NAME} already exists.`)
    }
  } catch (error) {
    console.error(`Error checking/creating database: ${error.message}`)
    throw error
  } finally {
    await client.end() // finally close the db connection all after queries.
  }
}

// Initialize and export the Sequelize instance
export async function initializeDatabase() {
  try {
    await createDatabaseIfNotExists() // First ensure the database exists

    // Then create the Sequelize connection
    const sequelize = new Sequelize(DB_NAME, DB_USER_NAME, DB_USER_PASSWORD, {
      host: DB_HOST_NAME,
      port: DB_PORT_NO,
      dialect: dialect,
      logging: false,
    })

    await sequelize.authenticate() // Test the connection
    console.log("Database connection has been established successfully.")

    return sequelize // return the sequelize instance(object)
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`)
    throw error
  }
}
export const sequelize = await initializeDatabase()
