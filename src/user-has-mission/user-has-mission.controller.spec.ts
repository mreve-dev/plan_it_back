import { Test, TestingModule } from '@nestjs/testing';
import { UserHasMissionController } from './user-has-mission.controller';
import { UserHasMissionService } from './user-has-mission.service';

describe('UserHasMissionController', () => {
  let controller: UserHasMissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserHasMissionController],
      providers: [UserHasMissionService],
    }).compile();

    controller = module.get<UserHasMissionController>(UserHasMissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
