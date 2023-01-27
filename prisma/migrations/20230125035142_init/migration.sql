/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,memberId]` on the table `WorkSpaceMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkSpaceMembers_workspaceId_memberId_key" ON "WorkSpaceMembers"("workspaceId", "memberId");
