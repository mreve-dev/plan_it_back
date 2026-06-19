-- DropForeignKey
ALTER TABLE `Mission` DROP FOREIGN KEY `Mission_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `MissionSlot` DROP FOREIGN KEY `MissionSlot_missionId_fkey`;

-- DropForeignKey
ALTER TABLE `User_Has_Mission` DROP FOREIGN KEY `User_Has_Mission_slotId_fkey`;

-- DropIndex
DROP INDEX `Mission_eventId_fkey` ON `Mission`;

-- DropIndex
DROP INDEX `MissionSlot_missionId_fkey` ON `MissionSlot`;

-- DropIndex
DROP INDEX `User_Has_Mission_slotId_fkey` ON `User_Has_Mission`;

-- AddForeignKey
ALTER TABLE `Mission` ADD CONSTRAINT `Mission_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Evnt`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MissionSlot` ADD CONSTRAINT `MissionSlot_missionId_fkey` FOREIGN KEY (`missionId`) REFERENCES `Mission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Has_Mission` ADD CONSTRAINT `User_Has_Mission_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `MissionSlot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
