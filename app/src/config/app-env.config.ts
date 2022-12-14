export default () => ({
  port: parseInt(process.env.PORT),
  postgres: {
    url: process.env.MINIATOR_AUTH_POSTGRES_URL,
    port: +process.env.MINIATOR_AUTH_POSTGRES_PORT,
    username: process.env.MINIATOR_AUTH_POSTGRES_USERNAME,
    password: process.env.MINIATOR_AUTH_POSTGRES_PASSWORD,
    dbname: process.env.MINIATOR_AUTH_POSTGRES_DBNAME,
  },
  admin: {
    superAdminJwtSecret: process.env.MINIATOR_AUTH_SUPER_ADMIN_JWT_SECRET,
    superAdminJwtExpirationTime:
      process.env.MINIATOR_AUTH_SUPER_ADMIN_JWT_EXPIRATION_TIME,
    superAdminUserName: process.env.MINIATOR_SUPER_ADMIN_USERNAME,
    superAdminPasswordHash: process.env.MINIATOR_SUPER_ADMIN_PASSWORD,
    subAdminJwtSecret: process.env.MINIATOR_AUTH_SUB_ADMIN_JWT_SECRET,
    subAdminJwtExpirationTime:
      process.env.MINIATOR_AUTH_SUB_ADMIN_JWT_EXPIRATION_TIME,
  },
  user: {
    userJwtSecret: process.env.MINIATOR_AUTH_USER_JWT_SECRET,
    userJwtExpirationTime: process.env.MINIATOR_AUTH_USER_JWT_EXPIRATION_TIME,
  },
  swagger: {
    username: process.env.MINIATOR_SWAGGER_USERNAME,
    password: process.env.MINIATOR_SWAGGER_PASSWORD,
  },
});
