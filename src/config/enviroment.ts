import 'dotenv/config';

export const env = {
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_USERNAME: process.env.MYSQL_USERNAME,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,

  PORT: process.env.PORT,
  SECRETKEY: process.env.SECRETKEY,
  EXPIRESIN: process.env.EXPIRESIN,
  SECRETKEY_REFRESH: process.env.SECRETKEY_REFRESH,
  EXPIRESIN_REFRESH: process.env.EXPIRESIN_REFRESH,
};
