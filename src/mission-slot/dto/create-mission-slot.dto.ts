import { Type } from "class-transformer"
import { IsDate, IsInt, Matches, Min } from "class-validator"

export class CreateMissionSlotDto {
    @IsInt()
    @Min(1)
    max_volunteers!: number

    @Type(() => Date)
    @IsDate()
    date!: Date


    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "start_hour must be in HH:mm format"
    })
    start_hour!: string


    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "end_hour must be in HH:mm format"
    })
    end_hour!: string

    @IsInt()
    missionId!: number

}