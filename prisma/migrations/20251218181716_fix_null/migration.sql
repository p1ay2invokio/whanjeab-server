/*
  Warnings:

  - Made the column `request` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `keygen` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `keygen_max` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `request_max` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "request" SET NOT NULL,
ALTER COLUMN "keygen" SET NOT NULL,
ALTER COLUMN "keygen_max" SET NOT NULL,
ALTER COLUMN "request_max" SET NOT NULL;
