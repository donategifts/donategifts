import { GraphQLType } from 'graphql';

export interface IMutationConfig {
  name: string;
  type: GraphQLType;
  args: { [p: string]: GraphQLType };
  description: string;
  attributes: {
    [p: string]: { name: string; description: string; type: GraphQLType };
  };
  resolver: <T>(...args: T[]) => T;
  preProcessor?: <T>(...args: T[]) => void;
  postProcessor?: <T>(...args: T[]) => void;
}

export interface IMutation {
  name: string;
  type: GraphQLType;
  args: { [p: string]: GraphQLType };
  description: string;
  attributes: {
    [p: string]: { name: string; description: string; type: GraphQLType };
  };
  resolver: <T>(...args: T[]) => T;
}

export default class Mutation {
  private readonly _name: string;

  private readonly _type: GraphQLType;

  private readonly _args: { [p: string]: GraphQLType };

  private readonly _description: string;

  private readonly _attributes: {
    [p: string]: { name: string; description: string; type: GraphQLType };
  };

  private readonly _resolver: <T>(...args: T[]) => T;

  private _preProcessor?: <T>(...args: T[]) => void;

  private _postProcessor?: <T>(...args: T[]) => void;

  public constructor({
    name,
    type,
    args,
    description,
    attributes,
    resolver,
    preProcessor,
    postProcessor,
  }: IMutationConfig) {
    this._name = name;
    this._type = type;
    this._args = args;
    this._description = description;
    this._attributes = attributes;
    this._resolver = resolver;
    this._preProcessor = preProcessor;
    this._postProcessor = postProcessor;
  }

  public createMutation(): IMutation {
    return {
      name: this._name,
      type: this._type,
      args: this._args,
      description: this._description,
      attributes: this._attributes,
      resolver: this._resolver,
    };
  }
}
