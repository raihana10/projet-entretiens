const config = {
  development: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'committee_service_dev',
      dialect: 'postgres',
      logging: false
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '24h'
    },
    port: process.env.PORT || 3004
  },
  test: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'committee_service_test',
      dialect: 'postgres',
      logging: false
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'test-secret-key',
      expiresIn: '1h'
    },
    port: process.env.PORT || 3004
  },
  production: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dialect: 'postgres',
      logging: false
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    },
    port: process.env.PORT || 3004
  }
};

module.exports = config; 