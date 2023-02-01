import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const password = "123456";
  const email = "bebrin@mail.ru";
  const firstName = "Mike";
  const lastName = "Vazovsky";
  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashPassword,
    },
  });

  const genWorkspaces = []
  for(let i = 0; i < 100; i++){
    genWorkspaces.push({title: `Workspace ${i}`, ownerId: user.id})
  }
  const workspaces = await prisma.workSpace.createMany({
    data: genWorkspaces
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
