export type TypeObjectId<T> = string & { type: T };

export type APITypeObjectId<_T extends APIObjectType> = string;

export enum APIObjectType {
  User = 'User',
  Agency = 'Agency',
  Message = 'Message',
  Donation = 'Donation',
  Contact = 'Contact',
  WishCard = 'WishCard',
}

const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

function validateObjectId(id: string): boolean {
  return (id && id.length === 24 && checkForHexRegExp.test(id)) || false;
}

const isValidObjectId = <T>(str: string): str is TypeObjectId<T> => validateObjectId(str);

export class InvalidObjectId extends Error {
  constructor(s: string) {
    super(`given value "${s}" is not a valid id`);
    // Set the prototype explicitly. https://github.com/Microsoft/TypeScript/issues/13965
    Object.setPrototypeOf(this, InvalidObjectId.prototype);
  }
}

export const getObjectIdAsString = (objectId: TypeObjectId<any>): string => {
  // fallback
  const toStringId = objectId && (objectId as any)._id && (objectId as any)._id.toString();
  if (toStringId) {
    return toStringId;
  }

  // fastest
  const strValue = objectId && (objectId as any).str;
  if (strValue) {
    return strValue;
  }

  // also fast
  const strType =
    ((objectId && objectId.constructor === String) || typeof objectId === 'string') && objectId;
  if (strType) {
    return strType;
  }

  // 2nd fast
  const valueOf = objectId && (objectId as any).valueOf && (objectId as any).valueOf();
  if (valueOf && typeof valueOf === 'string') {
    return valueOf;
  }

  // slowest
  const toString = objectId && objectId.toString();
  if (toString) {
    return toString;
  }

  return objectId;
};

export const ObjectId = <T = never>(input: T extends never ? never : unknown): TypeObjectId<T> => {
  let myInput;
  if (typeof input !== 'string') {
    myInput = getObjectIdAsString(input as any);
    if (typeof myInput !== 'string' && input !== 0) {
      // allow '0'
      throw new Error(`invalid input: ${JSON.stringify(input)}`);
    }
  } else {
    myInput = input;
  }

  if (!isValidObjectId(myInput) && input !== 0) {
    throw new InvalidObjectId(myInput);
  }

  return input as TypeObjectId<T>;
};
