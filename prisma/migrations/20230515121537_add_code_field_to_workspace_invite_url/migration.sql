/*
  Warnings:

  - The primary key for the `WorkspaceInviteUrl` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `WorkspaceInviteUrl` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `WorkspaceInviteUrl` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `WorkspaceInviteUrl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkspaceInviteUrl" DROP CONSTRAINT "WorkspaceInviteUrl_pkey",
DROP COLUMN "id",
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInviteUrl_code_key" ON "WorkspaceInviteUrl"("code");
