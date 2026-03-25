import { IsNotEmpty, IsString } from "class-validator"

export class CreateMissionDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    description: string
    max_volunteers: number
    start_hour: Date
    end_hour: Date
    eventId: number
    creatorId: number
}
