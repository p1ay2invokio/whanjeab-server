-- AlterTable
ALTER TABLE "User" ADD COLUMN     "keygen_max" INTEGER DEFAULT 10,
ADD COLUMN     "request_max" INTEGER DEFAULT 200;
