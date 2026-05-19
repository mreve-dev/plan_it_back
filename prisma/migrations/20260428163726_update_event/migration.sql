/*
  Warnings:

  - Added the required column `end_hour` to the `Evnt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_hour` to the `Evnt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Evnt` ADD COLUMN `end_hour` TIME(0) NOT NULL,
    ADD COLUMN `start_hour` TIME(0) NOT NULL;
