import { CreateUserType } from "./createUser.type";

export type UpdateUserType = Partial<CreateUserType> & {verified?: boolean};