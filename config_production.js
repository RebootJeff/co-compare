module.exports = {
  host: process.env.HOSTNAME,
  port: process.env.PORT,
  db: {
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    options: {
      host: process.env.DB_HOSTNAME,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT,
      protocol: process.env.DB_PROTOCOL,
      logging: console.log,
      pool: { maxConnections: 10, maxIdleTime: 30000 }
    }
  },
  fb: {
    APP_KEY: process.env.FB_APP_KEY,
    SECRET: process.env.FB_SECRET,
    callbackURL: process.env.FB_CALLBACKURL
  }
};
