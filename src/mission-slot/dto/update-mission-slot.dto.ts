import { Type } from "class-transformer"
import { IsDate, IsInt, IsOptional, Matches, Min } from "class-validator"

export class UpdateMissionSlotDto {

    @IsOptional()
    @IsInt()
    @Min(1)
    max_volunteers?: number

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date?: Date


    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "start_hour must be in HH:mm format"
    })
    start_hour?: string


    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "end_hour must be in HH:mm format"
    })
    end_hour?: string

    @IsOptional()
    @IsInt()
    missionId?: number

}