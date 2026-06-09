/*
  Warnings:

  - You are about to drop the `Document_Has_Evnt` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `url` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Document_Has_Evnt` DROP FOREIGN KEY `Document_Has_Evnt_documentId_fkey`;

-- DropForeignKey
ALTER TABLE `Document_Has_Evnt` DROP FOREIGN KEY `Document_Has_Evnt_evntId_fkey`;

-- AlterTable
ALTER TABLE `Document` ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Document_Has_Evnt`;

-- CreateTable
CREATE TABLE `Event_Has_Document` (
    `documentId` INTEGER NOT NULL,
    `evntId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`documentId`, `evntId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event_Has_Document` ADD CONSTRAINT `Event_Has_Document_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Has_Document` ADD CONSTRAINT `Event_Has_Document_evntId_fkey` FOREIGN KEY (`evntId`) REFERENCES `Evnt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
