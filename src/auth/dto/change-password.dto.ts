import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class ChangePassword {

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({minLength:6,minSymbols:1,minLowercase:1,minNumbers:3,minUppercase:1})
    password!: string

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({minLength:6,minSymbols:1,minLowercase:1,minNumbers:3,minUppercase:1})
    newpassword!: string
}