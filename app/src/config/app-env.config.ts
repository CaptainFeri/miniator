export default () => ({
  port: parseInt(process.env.PORT),
  postgres: {
    url: process.env.MINIATOR_AUTH_POSTGRES_URL,
    port: +process.env.MINIATOR_AUTH_POSTGRES_PORT,
    username: process.env.MINIATOR_AUTH_POSTGRES_USERNAME,
    password: process.env.MINIATOR_AUTH_POSTGRES_PASSWORD,
    dbname: process.env.MINIATOR_AUTH_POSTGRES_DBNAME,
  },
});
