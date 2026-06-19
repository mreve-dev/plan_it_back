import { Test, TestingModule } from '@nestjs/testing';
import { UserHasMissionService } from './user-has-mission.service';

describe('UserHasMissionService', () => {
  let service: UserHasMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserHasMissionService],
    }).compile();

    service = module.get<UserHasMissionService>(UserHasMissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
