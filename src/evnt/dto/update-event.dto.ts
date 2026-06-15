import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { Type } from "class-transformer"
import { IsDate, IsInt, IsOptional, IsString, isString, Matches } from "class-validator"

export class UpdateEventDto extends PartialType(CreateEventDto) {
    @IsString()
    @IsOptional()
    name?: string

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    start_date?: Date


    @Type(() => Date)
    @IsDate()
    @IsOptional()
    end_date?: Date

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "start_hour must be in HH:mm format"
    })
    @IsOptional()
    start_hour?: string


    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "end_hour must be in HH:mm format"
    })
    @IsOptional()
    end_hour?: string

    @IsString()
    @IsOptional()
    location?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsInt()
    @IsOptional()
    categoryId?: number

    @IsInt()
    @IsOptional()
    documentId?: number
}
