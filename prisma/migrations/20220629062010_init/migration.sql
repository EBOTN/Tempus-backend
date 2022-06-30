-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "creatorId" INTEGER NOT NULL,
    "workerId" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "creator_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "worker_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
