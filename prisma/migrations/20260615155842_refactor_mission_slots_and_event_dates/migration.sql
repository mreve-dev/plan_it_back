/*
  Warnings:

  - You are about to drop the column `date` on the `Evnt` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `end_hour` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `max_volunteers` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `start_hour` on the `Mission` table. All the data in the column will be lost.
  - The primary key for the `User_Has_Mission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `missionId` on the `User_Has_Mission` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `Evnt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Evnt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotId` to the `User_Has_Mission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User_Has_Mission` DROP FOREIGN KEY `User_Has_Mission_missionId_fkey`;

-- DropIndex
DROP INDEX `User_Has_Mission_missionId_fkey` ON `User_Has_Mission`;

-- AlterTable
ALTER TABLE `Evnt` DROP COLUMN `date`,
    ADD COLUMN `start_date` DATE NOT NULL DEFAULT '2026-01-01',
    ADD COLUMN `end_date` DATE NOT NULL DEFAULT '2026-01-01';
    

-- AlterTable
ALTER TABLE `Mission` DROP COLUMN `date`,
    DROP COLUMN `end_hour`,
    DROP COLUMN `max_volunteers`,
    DROP COLUMN `start_hour`,
    ADD COLUMN `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `User_Has_Mission` DROP PRIMARY KEY,
    DROP COLUMN `missionId`,
    ADD COLUMN `slotId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `slotId`);

-- CreateTable
CREATE TABLE `MissionSlot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `start_hour` TIME(0) NOT NULL,
    `end_hour` TIME(0) NOT NULL,
    `max_volunteers` INTEGER NOT NULL,
    `missionId` INTEGER NOT NULL,
    `updatedById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mission` ADD CONSTRAINT `Mission_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MissionSlot` ADD CONSTRAINT `MissionSlot_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MissionSlot` ADD CONSTRAINT `MissionSlot_missionId_fkey` FOREIGN KEY (`missionId`) REFERENCES `Mission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Has_Mission` ADD CONSTRAINT `User_Has_Mission_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `MissionSlot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
