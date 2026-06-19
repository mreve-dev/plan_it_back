-- DropForeignKey
ALTER TABLE `Event_Has_Document` DROP FOREIGN KEY `Event_Has_Document_evntId_fkey`;

-- DropIndex
DROP INDEX `Event_Has_Document_evntId_fkey` ON `Event_Has_Document`;

-- AddForeignKey
ALTER TABLE `Event_Has_Document` ADD CONSTRAINT `Event_Has_Document_evntId_fkey` FOREIGN KEY (`evntId`) REFERENCES `Evnt`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
