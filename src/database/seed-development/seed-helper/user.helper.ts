/* eslint-disable max-len */
import {ERole, UserStatus} from "../../../common/enums";
import {Role, User} from "../../../common/entity";

export class UserHepler {
  private _data: User[];

  constructor(role: Role[]) {
    this._data = this.getData(role);
  }

  private getData(role: Role[]): any[] {
    return [
      User.create({
        fullName: "Admin",
        password: "ADMIN",
        email: "admin@gmail.com",
        phone: "0327571918",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU",
        gender: "MALE",
        birthday: "2011-10-05T14:48:00.000Z",
        bio: "I'm admin",
        note: "Nothing",
        status: UserStatus.ACTIVE,
        role: role.find(item => item.name === ERole.ADMIN)
      }),
      User.create({
        fullName: "Operator",
        email: "operator@gmail.com",
        password: "OPERATOR",
        phone: "0327571919",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU",
        gender: "MALE",
        birthday: "2011-10-05T14:48:00.000Z",
        bio: "I'm operator",
        note: "Nothing",
        status: UserStatus.ACTIVE,
        role: role.find(item => item.name === ERole.OPERATOR)
      }),
      User.create({
        fullName: "Sale",
        email: "sale@gmail.com",
        password: "SALE",
        phone: "0327571920",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU",
        gender: "FEMALE",
        birthday: "2011-10-05T14:48:00.000Z",
        bio: "I'm sale",
        note: "Nothing",
        status: UserStatus.ACTIVE,
        role: role.find(item => item.name === ERole.SALE)
      }),
      User.create({
        fullName: "Intern",
        email: "intern@gmail.com",
        password: "INTERN",
        phone: "0327571921",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU",
        gender: "MALE",
        birthday: "2011-10-05T14:48:00.000Z",
        bio: "I'm intern",
        note: "Nothing",
        status: UserStatus.ACTIVE,
        role: role.find(item => item.name === ERole.INTERN)
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
