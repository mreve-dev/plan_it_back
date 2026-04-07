import { Type } from "class-transformer"
import { IsDate, isDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"
import { GenderEnum, RoleEnum } from "prisma/generated/prisma/enums"
import { dateTimestampProvider } from "rxjs/internal/scheduler/dateTimestampProvider"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstname: string

    @IsString()
    @IsNotEmpty()
    lastname: string

    @IsEnum(GenderEnum)
    gender: GenderEnum

    @IsEmail()
    email: string

    @IsStrongPassword({minLength:4,minSymbols:0,minLowercase:1,minNumbers:3,minUppercase:1})
    password: string

    @Type(() => Date)
    @IsDate()
    date_of_birth: Date

    @IsEnum(RoleEnum)
    @IsOptional()
    role: RoleEnum
}