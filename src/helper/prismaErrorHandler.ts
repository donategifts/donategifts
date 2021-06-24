import { CustomError } from './customError';

export const handlePrismaError = (
  error: Error & {
    code: string;
  },
): Error => {
  const { code } = error;

  // TODO: add more handling? https://www.prisma.io/docs/reference/api-reference/error-reference
  switch (code) {
    case 'P2000':
      return new CustomError({
        message:
          "The provided value for the column is too long for the column's type.",
        code: 'ColumnLength',
        status: 500,
        error,
      });
    case 'P2001':
      return new CustomError({
        message:
          'The record searched for in the where condition does not exist',
        code: 'RecordMissing',
        status: 500,
        error,
      });
    case 'P2002':
      return new CustomError({
        message: 'Unique constraint failed',
        code: 'DuplicateEntry',
        status: 500,
        error,
      });
    case 'P2003':
      return new CustomError({
        message: 'Foreign key constraint failed on the field',
        code: 'ForeignKeyDuplicateEntry',
        status: 500,
        error,
      });
    case 'P2004':
      return new CustomError({
        message: 'A constraint failed on the database',
        code: 'DatabaseConstraint',
        status: 500,
        error,
      });
    case 'P2005':
      return new CustomError({
        message:
          "The value stored in the database for the specified field is invalid for the field's type",
        code: 'FieldTypeMissMatch',
        status: 500,
        error,
      });
    case 'P2006':
      return new CustomError({
        message: 'The Provided value is not valid',
        code: 'ValueMissMatch',
        status: 500,
        error,
      });
    default:
      return new CustomError({
        message: 'Unhandled Prisma Error',
        code: 'UnhandledPrismaError',
        status: 500,
        error,
      });
  }
};
