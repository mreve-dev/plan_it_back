import { User } from "prisma/generated/prisma/client";


export type UserWTPwd = Omit<User, "password">