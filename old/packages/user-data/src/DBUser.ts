import { prisma } from '@donategifts/db-connection';

export { User, UserCreateInput, UserUpdateInput } from '@prisma/client';
export const DBUser = prisma.user;
