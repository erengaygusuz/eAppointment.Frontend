import { RoleModel } from "./role.model";

export class UserModel {
    id: string = "";
    firstName: string = "";
    lastName: string = "";
    fullName: string = "";
    userName: string = "";
    email: string = "";
    password: string = "";
    roles: RoleModel[] = [];
}