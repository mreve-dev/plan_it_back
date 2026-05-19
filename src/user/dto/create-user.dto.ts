import { Type } from "class-transformer"
import { IsDate, isDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"
import { RoleEnum } from "prisma/generated/prisma/enums"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstname!: string

    @IsString()
    @IsNotEmpty()
    lastname!: string

    @IsEmail()
    email!: string

    @IsStrongPassword({minLength:6,minSymbols:1,minLowercase:1,minNumbers:3,minUppercase:1})
    password!: string

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    date_of_birth?: Date

    @IsEnum(RoleEnum)
    @IsOptional()
    role!: RoleEnum
}