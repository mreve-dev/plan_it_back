// dto/update-role.dto.ts
import { IsEnum } from 'class-validator'
import { RoleEnum } from 'prisma/generated/prisma/enums'

export class UpdateRoleDto {
  @IsEnum(RoleEnum)
  role!: RoleEnum
}