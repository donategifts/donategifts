import { user as User, user_role } from '@prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { CustomError } from '../helper/customError';
import { IContext } from '../types/Context';
import { generateCustomToken, JWT_TOKEN_EXPIRES_IN } from '../helper/jwt';
import { handlePrismaError } from '../helper/prismaErrorHandler';

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

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
      const err = handlePrismaError(error);
      throw err;
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
  register: async ({
    context,
    registerData,
  }: {
    context: IContext;
    registerData: Pick<
      User,
      'firstName' | 'lastName' | 'email' | 'loginMode' | 'password'
    >;
  }): Promise<User> => {
    const { firstName, lastName, email, loginMode, password } = registerData;

    const hash = hashSync(password, BCRYPT_SALT_ROUNDS);

    try {
      const user = await context.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          loginMode,
          password: hash,
          role: user_role.donor,
        },
      });

      return user;
    } catch (error) {
      const err = handlePrismaError(error);
      throw err;
    }
  },
};
