import { Type } from "class-transformer"
import { IsArray, IsDate, IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, Matches, Min, ValidateNested } from "class-validator"
import { CreateMissionSlotDto } from "src/mission-slot/dto/create-mission-slot.dto"


export class CreateMissionDto {

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    description!: string

    @IsInt()
    eventId!: number

    @IsInt()
    creatorId!: number

    // Un tableau de slots à créer en même tps que la mission
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateMissionSlotDto)
    slots!: CreateMissionSlotDto[]
}
