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

  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || null;

  // 1) Сначала ищем пользователя по Clerk ID
  const existingByExternalAuthId = await prisma.user.findUnique({
    where: { externalAuthId: userId },
    include: { subscription: true },
  });

  if (existingByExternalAuthId) {
    const updated = await prisma.user.update({
      where: { id: existingByExternalAuthId.id },
      data: {
        email,
        name,
      },
      include: { subscription: true },
    });

    if (updated.subscription) {
      return updated;
    }

    return prisma.user.update({
      where: { id: updated.id },
      data: {
        subscription: {
          create: {
            plan: "free",
            status: "active",
          },
        },
      },
      include: { subscription: true },
    });
  }

  // 2) Если по Clerk ID не нашли, ищем по email
  // Это как раз чинит текущую ошибку unique email
  const existingByEmail = await prisma.user.findUnique({
    where: { email },
    include: { subscription: true },
  });

  if (existingByEmail) {
    const updated = await prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        externalAuthId: userId,
        name,
      },
      include: { subscription: true },
    });

    if (updated.subscription) {
      return updated;
    }

    return prisma.user.update({
      where: { id: updated.id },
      data: {
        subscription: {
          create: {
            plan: "free",
            status: "active",
          },
        },
      },
      include: { subscription: true },
    });
  }

  // 3) Если вообще никого нет — создаём нового
  return prisma.user.create({
    data: {
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
    include: { subscription: true },
  });
}