import {
  hashSync,
  compareSync
} from "bcryptjs";
import {SALT_ROUNDS} from "../env";

class Service {
  private saltRound: number;

  constructor(config: number) {
    this.saltRound = config;
  }

  hash(data: string): string {
    return hashSync(data, this.saltRound);
  }

  compare(data: string, ecrypted: string): boolean {
    return compareSync(data, ecrypted);
  }
}

export const BcryptService = new Service(SALT_ROUNDS);
