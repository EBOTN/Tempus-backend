-- CreateTable
CREATE TABLE "Tokens" (
    "Id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "id" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "user_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
