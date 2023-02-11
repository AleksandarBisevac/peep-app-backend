import dotenv from "dotenv";

dotenv.config({});

class Config {
  public PORT: number;
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;

  private readonly DEFAULT_PORT = "5000";
  private readonly DEFAULT_DATABASE_URL =
    "mongodb://127.0.0.1:27017/peep-app-backend";

  constructor() {
    this.PORT = parseInt(process.env.PORT || this.DEFAULT_PORT, 10);
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || "";
    this.NODE_ENV = process.env.NODE_ENV || "development";
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || "";
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || "";
    this.CLIENT_URL = process.env.CLIENT_URL || "";
    this.REDIS_HOST = process.env.REDIS_HOST || "";
  }

  // This method is called in src/app.ts
  // to ensure that all the required configuration values are set
  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined || value === null) {
        throw new Error(`Missing config value for ${key}`);
      }
    }
  }
}

export const config: Config = new Config();
