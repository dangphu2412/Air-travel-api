import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config({ path: '.env' });

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOSTNAME,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: process.env.NODE_ENV === 'production' ? false : true,
  entities: ['dist/**/*.entity{.ts,.js}']
};
