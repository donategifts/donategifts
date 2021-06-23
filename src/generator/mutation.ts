import { GraphQLObjectType, GraphQLType } from 'graphql';
import { CustomError } from '../helper/customError';
import { IContext, Roles } from '../types/Context';

export interface IMutationConfig {
  name: string;
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
  preProcessor?: ({ ...args }, context: IContext) => Promise<void>;
  postProcessor?: (
    { ...args },
    context: IContext,
    result?: any,
  ) => Promise<any>;
}

export interface IMutation {
  name: string;
  description: string;
  type: GraphQLObjectType<any, any>;
  args: { [p: string]: any };
  resolve: (
    parent: Record<string, unknown>,
    { ...args },
    context: IContext,
  ) => any;
}

export default class Mutation {
  private readonly _name: string;

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

  private readonly _preProcessor?: (
    { ...args },
    context: IContext,
  ) => Promise<void>;

  private readonly _postProcessor?: (
    { ...args },
    context: IContext,
    result?: any,
  ) => Promise<any>;

  public constructor({
    name,
    description,
    attributes,
    args,
    resolve,
    preProcessor,
    postProcessor,
  }: IMutationConfig) {
    this._name = name;
    this._description = description;
    this._attributes = [...attributes];
    this._args = args;
    this._resolve = resolve;
    this._preProcessor = preProcessor;
    this._postProcessor = postProcessor;
  }

  private handleProcessors = async (
    _parent: Record<string, unknown>,
    args: { [x: string]: any },
    context: IContext,
  ): Promise<any> => {
    if (this._resolve && typeof this._resolve === 'function') {
      if (this._preProcessor) {
        if (typeof this._preProcessor === 'function') {
          await this._preProcessor(args, context);
        } else {
          throw new CustomError({
            message: 'PreProcessor must be a function',
            code: 'PreProcessorTypeMissMatch',
            status: 500,
          });
        }
      }

      let result = await this._resolve({}, args, context);

      if (this._postProcessor) {
        if (typeof this._postProcessor === 'function') {
          result = await this._postProcessor(args, context, result);
        } else {
          throw new CustomError({
            message: 'PostProcessor must be a function',
            code: 'PostProcessorTypeMissMatch',
            status: 500,
          });
        }
      }

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

  public createMutation(): IMutation {
    return {
      name: this._name,
      type: this.generateType(),
      description: this._description,
      args: this._args,
      resolve: this.handleProcessors,
    };
  }
}
