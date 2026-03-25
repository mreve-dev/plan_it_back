-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('benevole', 'referent_coordinateur') NULL DEFAULT 'benevole';
