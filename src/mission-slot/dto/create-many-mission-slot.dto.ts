import { Type } from "class-transformer"
import { IsArray, IsInt, ValidateNested } from "class-validator"
import { CreateMissionSlotDto } from "./create-mission-slot.dto"
import { CreateMissionSlotInlineDto } from "src/mission/dto/create-mission-slot-inline.dto"

export class CreateManyMissionSlotDto {
    @IsInt()
    missionId!: number

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMissionSlotInlineDto)
    slots!: CreateMissionSlotInlineDto[]
}