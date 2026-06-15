import { Test, TestingModule } from '@nestjs/testing';
import { MissionSlotController } from './mission-slot.controller';
import { MissionSlotService } from './mission-slot.service';

describe('MissionSlotController', () => {
  let controller: MissionSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionSlotController],
      providers: [MissionSlotService],
    }).compile();

    controller = module.get<MissionSlotController>(MissionSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
