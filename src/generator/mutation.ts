import { GraphQLType } from 'graphql';
import { CustomError } from '../helper/customError';
import { IContext } from '../types/Context';

export interface IMutationConfig {
  name: string;
  type: any;
  args: { [p: string]: any };
  description: string;
  attributes: {
    [p: string]: { name: string; description: string; type: GraphQLType };
  };
  /**
   * @type T is used for the arguments, R is the type for the response
   * @param context The context object received from apollo
   * @param args An object with key-value pairs from the mutation
   */
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
  type: any;
  args: { [p: string]: any };
  description: string;
  attributes: {
    [p: string]: { name: string; description: string; type: GraphQLType };
  };
  /**
   * @type T is used for the arguments, R is the type for the response
   * @param context The context object received from apollo
   * @param args An object with key-value pairs from the mutation
   */
  resolve: (
    parent: Record<string, unknown>,
    { ...args },
    context: IContext,
  ) => any;
}

export default class Mutation {
  private _name: string;

  private _type: GraphQLType;

  private _args: { [p: string]: any };

  private _description: string;

  private _attributes: {
    [p: string]: { name: string; description: string; type: GraphQLType };
  };

  private _resolve: (
    parent: Record<string, unknown>,
    { ...args },
    context: IContext,
  ) => any;

  private _preProcessor?: ({ ...args }, context: IContext) => Promise<void>;

  private _postProcessor?: (
    { ...args },
    context: IContext,
    result?: any,
  ) => Promise<any>;

  public constructor({
    name,
    type,
    args,
    description,
    attributes,
    resolve,
    preProcessor,
    postProcessor,
  }: IMutationConfig) {
    this._name = name;
    this._type = type;
    this._args = args;
    this._description = description;
    this._attributes = attributes;
    this._resolve = resolve;
    this._preProcessor = preProcessor;
    this._postProcessor = postProcessor;
  }

  private handleProcessors = async <T, R>(
    _parent: Record<string, unknown>,
    args: T,
    context: IContext,
  ): Promise<R> => {
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

      return result;
    }

    throw new CustomError({
      message: 'Resolver must be a function',
      code: 'ResolverTypeMissMatch',
      status: 500,
    });
  };

  public createMutation(): IMutation {
    return {
      name: this._name,
      type: this._type,
      args: this._args,
      description: this._description,
      attributes: this._attributes,
      resolve: this.handleProcessors,
    };
  }
}
