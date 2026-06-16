// src/mission/dto/create-mission-slot-inline.dto.ts
import { Type } from "class-transformer"
import { IsDate, IsInt, Matches, Min } from "class-validator"

export class CreateMissionSlotInlineDto {
    @IsInt()
    @Min(1)
    max_volunteers!: number

    @Type(() => Date)
    @IsDate()
    date!: Date

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    start_hour!: string

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    end_hour!: string
}