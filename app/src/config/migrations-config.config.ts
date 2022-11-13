import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const config = new DataSource({
  type: 'postgres',
  host: process.env.MINIATOR_AUTH_POSTGRES_URL,
  port: parseInt(process.env.MINIATOR_AUTH_POSTGRES_PORT, 10),
  username: process.env.MINIATOR_AUTH_POSTGRES_USERNAME,
  password: process.env.MINIATOR_AUTH_POSTGRES_PASSWORD,
  database: process.env.MINIATOR_AUTH_POSTGRES_DBNAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
});

export default config;
