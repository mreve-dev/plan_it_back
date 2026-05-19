/*
  Warnings:

  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `date_of_birth` DATE NULL,
    MODIFY `role` ENUM('benevole', 'admin') NOT NULL;
