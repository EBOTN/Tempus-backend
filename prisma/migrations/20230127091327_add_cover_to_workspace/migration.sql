/*
  Warnings:

  - You are about to drop the column `description` on the `WorkSpace` table. All the data in the column will be lost.
  - Added the required column `cover` to the `WorkSpace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkSpace" DROP COLUMN "description",
ADD COLUMN     "cover" TEXT NOT NULL;
