// import {JwtService} from "@nestjs/jwt";
// import {JWT_CONFIG} from "../../../../common/constants";
// import {User} from "../../../../common/entity";
// import {IUserLoginResponse} from "../../../../common/interface/t.jwtPayload";
// import {UserRepository} from "../../User/index.repository";
// import {UserService} from "../../User/index.service";
// import {AuthController} from "../index.controller";
// import {AuthService} from "../index.service";

// describe("AuthController", () => {
//   let controller: AuthController;
//   let service: AuthService;
//   let userService: UserService;
//   let userRepo: UserRepository;
//   let jwtService: JwtService;

//   beforeEach(() => {
//     userRepo = new UserRepository();
//     userService = new UserService(userRepo);
//     jwtService = new JwtService({
//       secret: JWT_CONFIG.SECRET,
//       signOptions: {expiresIn: "1d"}
//     });
//     service = new AuthService(userService, jwtService);
//     controller = new AuthController(service);
//   });

//   describe("login", () => {
//     const user = new User();
//     user.username = "Admin";
//     user.password = "ADMIN";
//     it("Login infomation", async () => {
//       const result: IUserLoginResponse = {
//         token: "asd",
//         info: {
//           username: "Admin"
//         }
//       };
//       jest.spyOn(service, "login").mockImplementation(() => result);

//       expect(await controller.login(user)).toBe(result);
//     });
//   });
// });
