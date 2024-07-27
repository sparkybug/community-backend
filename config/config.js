require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_DATABASE_DEV,
    port: process.env.DB_PORT_DEV,
    host: process.env.DB_HOST_DEV,
    dialect: process.env.DB_DIALECT_DEV,
    dialectOptions: {
      ssl: {
        require: process.env.DB_DIALECT_OPTIONS_DEV_SSL_REQUIRE === 'true',
        rejectUnauthorized: process.env.DB_DIALECT_OPTIONS_DEV_SSL_REJECT_UNAUTHORIZED === 'true',
      },
    },
  },
  test: {
    username: process.env.DB_USERNAME_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_DATABASE_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: process.env.DB_DIALECT_TEST,
  },
  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_DATABASE_PROD,
    port: process.env.DB_PORT_PROD,
    host: process.env.DB_HOST_PROD,
    dialect: process.env.DB_DIALECT_PROD,
    dialectOptions: {
      ssl: {
        require: process.env.DB_DIALECT_OPTIONS_PROD_SSL_REQUIRE === 'true',
        rejectUnauthorized: process.env.DB_DIALECT_OPTIONS_PROD_SSL_REJECT_UNAUTHORIZED === 'true',
      },
    },
  },
};
