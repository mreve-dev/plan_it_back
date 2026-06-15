import { Test, TestingModule } from '@nestjs/testing';
import { MissionSlotService } from './mission-slot.service';

describe('MissionSlotService', () => {
  let service: MissionSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionSlotService],
    }).compile();

    service = module.get<MissionSlotService>(MissionSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
