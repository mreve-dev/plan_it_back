import { User } from "../entities/user.entity";

export type UserWTPwd = Omit<User, "password">