-- AlterTable
ALTER TABLE `Evnt` ADD COLUMN `updatedById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Evnt` ADD CONSTRAINT `Evnt_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
