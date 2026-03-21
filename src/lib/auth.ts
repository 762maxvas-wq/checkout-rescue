import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireAppUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthorized");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;

  if (!email) {
    throw new Error("email_required");
  }

  const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || null;

  const user = await prisma.user.upsert({
    where: { externalAuthId: userId },
    update: {
      email,
      name,
    },
    create: {
      externalAuthId: userId,
      email,
      name,
      subscription: {
        create: {
          plan: "free",
          status: "active",
        },
      },
    },
    include: {
      subscription: true,
    },
  });

  return user;
}
