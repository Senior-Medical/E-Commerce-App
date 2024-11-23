import { Role } from "src/auth/enums/roles.enum";

export type CreateUserType = {
  name: string;
  username?: string;
  phone?: string;
  email: string;
  password: string;
  role?: Role;
  bio?: string;
  company?: string;
  emailValidated?: boolean;
  phoneValidated?: boolean;
}