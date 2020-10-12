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
        username: "Moderator",
        password: "MODERATOR",
        role: role.find(item => item.name === ERole.MODERATOR)
      }),
      User.create({
        username: "Super admin",
        password: "SUPER_ADMIN",
        role: role.find(item => item.name === ERole.SUPER_ADMIN)
      })
    ]
  }

  public initUser(): Promise<User[]> {
    return Promise.all(this._data.map(user => user.save()));
  }
}
