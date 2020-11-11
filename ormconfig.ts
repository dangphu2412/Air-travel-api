import {ENV} from "./src/env";

const seedingFolderName = ENV === "production" ? ENV : "development";

export = [
  {
    "name": "default",
    "type": "postgres",
    "url": process.env.DB_URI,
    "migrations": ["src/database/migrations/*.ts"],
    "entities": ["src/**/*.entity{.ts,.js}"],
    "factories": ["src/database/factories/**/*.factory{.ts,.js}"],
    "seeds": [`src/database/seed-${seedingFolderName}/**/*.seed{.ts,.js}`],
    "cli": {
      migrationsDir: "src/database/migrations"
    }
  }
];
