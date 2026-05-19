/*
  Warnings:

  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User_Has_Mission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Document_Has_Evnt` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Mission_has_Skill` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `gender`;

-- AlterTable
ALTER TABLE `User_Has_Mission` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `User_has_Skill` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
