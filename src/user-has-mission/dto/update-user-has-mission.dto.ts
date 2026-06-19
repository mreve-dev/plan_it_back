import { PartialType } from '@nestjs/mapped-types';
import { CreateUserHasMissionDto } from './create-user-has-mission.dto';

export class UpdateUserHasMissionDto extends PartialType(CreateUserHasMissionDto) {}
