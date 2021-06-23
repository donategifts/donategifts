import { GraphQLObjectType, GraphQLType } from 'graphql';
import { CustomError } from '../helper/customError';
import { IContext, Roles } from '../types/Context';

export interface IQueryConfig {
  name: string;
  /** can be specified it he returning data is a list of fields e.g. a list of all users */
  type?: any;
  description: string;
  attributes: {
    name: string;
    roles: Roles[];
    type: GraphQLType;
    description: string;
  }[];
  args: { [p: string]: any };
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
  private readonly _name: string;

  private readonly _type?: any;

  private readonly _description: string;

  private readonly _attributes: {
    name: string;
    roles: Roles[];
    type: GraphQLType;
    description: string;
  }[];

  private readonly _args: { [p: string]: any };

  private readonly _resolve: (
    parent: Record<string, unknown>,
    { ...args },
    context: IContext,
  ) => any;

  public constructor({
    name,
    type,
    description,
    attributes,
    args,
    resolve,
  }: IQueryConfig) {
    this._name = name;
    this._type = type;
    this._description = description;
    this._attributes = [...attributes];
    this._args = args;
    this._resolve = resolve;
  }

  private handleProcessors = async (
    _parent: Record<string, unknown>,
    args: { [x: string]: any },
    context: IContext,
  ): Promise<any> => {
    if (this._resolve && typeof this._resolve === 'function') {
      const result = this._resolve({}, args, context);

      const { userRole } = context;

      // check user roles and delete result entries if a role doesn't have access
      this._attributes.forEach((attribute) => {
        if (attribute.name in result) {
          if (!attribute.roles.includes(userRole)) {
            delete result[attribute.name];
          }
        }
      });

      return result;
    }

    throw new CustomError({
      message: 'Resolver must be a function',
      code: 'ResolverTypeMissMatch',
      status: 500,
    });
  };

  private generateType = (): GraphQLObjectType<any, any> => {
    const type = {};

    for (const attribute of this._attributes) {
      type[attribute.name] = {
        name: attribute.name,
        description: attribute.description,
        type: attribute.type,
      };
    }

    return new GraphQLObjectType({
      name: this._name,
      description: this._description,
      fields: type,
    });
  };

  public createQuery(): IQuery {
    return {
      name: this._name,
      type: this._type ? this._type(this.generateType()) : this.generateType(),
      description: this._description,
      args: this._args,
      resolve: this.handleProcessors,
    };
  }
}
