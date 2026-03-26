const { Client } = require('pg');
require('dotenv').config();

async function checkConnection() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    await client.connect();
    console.log('Successfully connected to database');
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }
}

checkConnection();
