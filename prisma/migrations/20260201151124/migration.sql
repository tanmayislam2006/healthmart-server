/*
  Warnings:

  - You are about to alter the column `price` on the `Medicine` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Medicine" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;
