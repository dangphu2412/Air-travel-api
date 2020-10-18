import {ERole} from "../../../common/enums";
import {Role, User} from "../../../common/entity";

export class UserHepler {
  private _data: User[];

  constructor(role: Role[]) {
    this._data = this.getData(role);
  }

  private getData(role: Role[]): User[] {
    return [
      User.create({
        username: "Admin",
        password: "ADMIN",
        role: role.find(item => item.name === ERole.ADMIN)
      }),
      User.create({
        username: "Operator",
        password: "OPERATOR",
        role: role.find(item => item.name === ERole.OPERATOR)
      }),
      User.create({
        username: "Sale",
        password: "SALE",
        role: role.find(item => item.name === ERole.SALE)
      })
    ]
  }

  public initUser(): Promise<User[]> {
    return Promise.all(this._data.map(user => user.save()));
  }

  public countUser(): Promise<number> {
    return User.count();
  }
}
