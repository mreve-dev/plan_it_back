import { Type } from "class-transformer"
import { IsDate, IsDateString, IsIn, IsInt, IsOptional, IsString, isString, Matches } from "class-validator"

export class CreateEventDto {

    @IsString()
    name!: string

    @Type(() => Date)
    @IsDate()
    start_date!: Date

    @Type(() => Date)
    @IsDate()
    end_date!: Date

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "start_hour must be in HH:mm format"
    })
    start_hour!: string


    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "end_hour must be in HH:mm format"
    })
    end_hour!: string

    @IsString()
    @IsOptional()
    location?: string

    @IsString()
    description!: string

    @IsInt()
    categoryId!: number

    @IsInt()
    creatorId!: number

    @IsInt()
    @IsOptional()
    documentId?: number
}
