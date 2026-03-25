import { Type } from "class-transformer"
import { IsDate, IsDateString, IsIn, IsInt, IsOptional, IsString, isString } from "class-validator"

export class CreateEventDto {

    @IsString()
    name: string

    @Type(() => Date)
    @IsDate()
    date: Date

    @IsString()
    @IsOptional()
    location?: string

    @IsString()
    description: string

    @IsInt()
    categoryId: number

    @IsInt()
    creatorId: number

    @IsInt()
    @IsOptional()
    documentId?: number
}
