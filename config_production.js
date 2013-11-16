module.exports = {
  host: process.env.HOSTNAME,
  port: process.env.PORT,
  db: {
    name: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    protocol: process.env.DB_PROTOCOL,
    logging: console.log
  },
  fb: {
    APP_KEY: process.env.FB_APP_KEY,
    SECRET: process.env.FB_SECRET,
    callbackURL: process.env.FB_CALLBACKURL
  }
};
