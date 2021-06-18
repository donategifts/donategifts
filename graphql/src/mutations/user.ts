import { user as User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { CustomError } from '../helper/customError';
import { IContext } from '../types/Context';
import { generateCustomToken, JWT_TOKEN_EXPIRES_IN } from '../helper/jwt';

export const userMutations = {
  login: async ({
    context,
    email,
    password,
  }: {
    context: IContext;
    email: string;
    password: string;
  }): Promise<User & { jwt: string }> => {
    let result: User | null;
    try {
      result = await context.prisma.user.findFirst({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new CustomError({
        message: 'Failed to fetch user password',
        code: 'PrismaFetchUserPasswordError',
        status: 500,
        error,
      });
    }

    if (!result) {
      throw new CustomError({
        message: 'Failed to authenticate user',
        code: 'NoUserFoundError',
        status: 401,
      });
    }

    const pwMatch = compareSync(password, result.password);

    if (pwMatch) {
      const { token } = generateCustomToken(
        {
          email,
          password,
          role: result.role,
        },
        'login',
        JWT_TOKEN_EXPIRES_IN,
      );

      return { ...result, jwt: token };
    }

    throw new CustomError({
      message: 'Passwords do not match',
      code: 'PasswordMissMatchError',
      status: 401,
    });
  },
};
