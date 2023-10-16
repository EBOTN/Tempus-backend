-- CreateTable
CREATE TABLE "WorkSpace" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "WorkSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSpaceMembers" (
    "id" SERIAL NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "WorkSpaceMembers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkSpace" ADD CONSTRAINT "owner_fk" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSpaceMembers" ADD CONSTRAINT "member_fk" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSpaceMembers" ADD CONSTRAINT "workspace_fk" FOREIGN KEY ("workspaceId") REFERENCES "WorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "workspace_fk" FOREIGN KEY ("workspaceId") REFERENCES "WorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
