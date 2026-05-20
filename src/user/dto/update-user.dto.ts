import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {


    @IsBoolean()
    @IsOptional()
    mustChangePassword?: boolean


    @IsBoolean()
    @IsOptional()
    isOnboarded?: boolean

    @IsArray()
    @IsInt({each:true}) // Chaque élément doit être une string
    @IsOptional()
    skillIds?: number[];
}
