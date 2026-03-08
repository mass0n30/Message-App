
const prisma  = require("../db/prismaClient.js");
const bcrypt = require("bcryptjs");

async function populateSeed() {
  const hashedPassword = await bcrypt.hash("#Messi30", 10);

  try {
   const user = await prisma.user.create({
      data: {
        alias: "mac123",
        fname: "Masson",
        lname: "Corlette",
        email: "massoncorlette@gmail.com",
        is_admin: true,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        userId: user.id,
        bio: "Hello! I'm Masson, a passionate software developer with a love for creating innovative solutions. With a background in full-stack development, I enjoy working on projects that challenge me to think outside the box and push the boundaries. I have a plethora of hobbies and love to stay active, I tend to spend my time exploring new topics and ideas, and always love to connect with like-minded individuals. Feel free to reach out and connect with me!",
        status: true,
      },
    });

    await prisma.chatRoom.create({
      data: {
        name: "General Chat",

        ownerId: user.id,
        topic: "General discussion about anything and everything.",
      },
    });
  } catch (error) {
    console.error("Error populating seed data:", error);
  }

  console.log("Seed data populated successfully.");

}

populateSeed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

module.exports = { populateSeed };
