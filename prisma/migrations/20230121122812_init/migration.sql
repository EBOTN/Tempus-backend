-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);
