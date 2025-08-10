const config = {
  development: {
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/company_service_dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '24h'
    },
    port: process.env.PORT || 3005
  },
  test: {
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/company_service_test',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'test-secret-key',
      expiresIn: '1h'
    },
    port: process.env.PORT || 3005
  },
  production: {
    database: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    },
    port: process.env.PORT || 3005
  }
};

module.exports = config; 