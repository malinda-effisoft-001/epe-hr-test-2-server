const dbConfig = {
  PROCE: process.env.DATA_BASE_HOST,
  USER: process.env.DATA_BASE_USERNAME,
  PASSWORD: process.env.DATA_BASE_PASSWORD,
  DB: process.env.DATA_BASE_NAME,
  dialect: process.env.DATA_BASE_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

module.exports = dbConfig;