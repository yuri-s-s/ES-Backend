require('dotenv/config');

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    define: {
      timestamps: true,
    },
    options: {
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
      timezone: '-03:00',
    },
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    options: {
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
      timezone: '-03:00',
    },
  },
};
