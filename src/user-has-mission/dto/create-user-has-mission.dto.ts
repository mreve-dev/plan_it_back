import { IsInt } from "class-validator"

export class CreateUserHasMissionDto {

    @IsInt()
    slotId!: number
}