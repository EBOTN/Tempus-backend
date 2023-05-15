-- CreateTable
CREATE TABLE "WorkspaceInviteUrl" (
    "id" SERIAL NOT NULL,
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "WorkspaceInviteUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInviteUrl_workspaceId_key" ON "WorkspaceInviteUrl"("workspaceId");

-- AddForeignKey
ALTER TABLE "WorkspaceInviteUrl" ADD CONSTRAINT "workspace_fk" FOREIGN KEY ("workspaceId") REFERENCES "WorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
