const seedingFolderName = process.env.NODE_ENV ? `seed-${process.env.NODE_ENV}` : "seed-development";
module.exports = [
  {
    "name": "default",
    "type": process.env.DB_TYPE,
    "host": process.env.DB_HOSTNAME,
    "port": process.env.DB_PORT,
    "database": process.env.DB_NAME,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "migrations": ["src/database/migrations/*.ts"],
    "entities": ["src/**/*.entity{.ts,.js}"],
    "factories": ["src/database/factories/**/*.factory{.ts,.js}"],
    "seeds": [`src/database/${seedingFolderName}/**/*.seed{.ts,.js}`],
    "cli": {
      migrationsDir: "src/database/migrations"
    }
  }
];
