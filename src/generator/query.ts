import { GraphQLType } from 'graphql';
import { CustomError } from '../helper/customError';
import { IContext } from '../types/Context';

export interface IQueryConfig {
  name: string;
  type: any;
  args: { [p: string]: any };
  description: string;
  resolve: (
    parent: Record<string, unknown>,
    { ...args },
    context: IContext,
  ) => any;
}

export interface IQuery {
  name: string;
  type: any;
  args: { [p: string]: any };
  description: string;
  resolve: (
    parent: Record<string, unknown>,
    { ...args },
    context: IContext,
  ) => any;
}

export default class Query {
  private _name: string;

  private _type: GraphQLType;

  private _args: { [p: string]: any };

  private _description: string;

  private _resolve: (
    parent: Record<string, unknown>,
    { ...args },
    context: IContext,
  ) => any;

  public constructor({ name, type, args, description, resolve }: IQueryConfig) {
    this._name = name;
    this._type = type;
    this._args = args;
    this._description = description;
    this._resolve = resolve;
  }

  private handleProcessors = async (
    _parent: Record<string, unknown>,
    args: { [x: string]: any },
    context: IContext,
  ): Promise<any> => {
    if (this._resolve && typeof this._resolve === 'function') {
      return this._resolve({}, args, context);
    }

    throw new CustomError({
      message: 'Resolver must be a function',
      code: 'ResolverTypeMissMatch',
      status: 500,
    });
  };

  public createQuery(): IQuery {
    return {
      name: this._name,
      type: this._type,
      description: this._description,
      args: this._args,
      resolve: this.handleProcessors,
    };
  }
}
