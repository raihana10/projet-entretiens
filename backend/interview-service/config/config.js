const config = {
  development: {
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/interview_service_db',
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '24h'
    },
    port: process.env.PORT || 3003
  },
  test: {
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/interview_service_test',
      options: {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'test-secret-key',
      expiresIn: '1h'
    },
    port: process.env.PORT || 3003
  },
  production: {
    database: {
      uri: process.env.MONGODB_URI,
      options: {
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    },
    port: process.env.PORT || 3003
  }
};

module.exports = config; 