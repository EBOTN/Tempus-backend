/*
  Warnings:

  - You are about to drop the `Tokens` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `refreshtoken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tokens" DROP CONSTRAINT "user_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshtoken" TEXT NOT NULL;

-- DropTable
DROP TABLE "Tokens";
