import {
  Pretify,
  PreserverOptionalKeys,
  WithDollar,
  KeysWithValOfType,
  ExtractFromPath,
  FlatPath,
  Plurial,
} from '../utils';
import {
  ObjectId,
  SchemaDefinition,
  ClientSession,
  SortOrder,
  ConditionalExpressionOperator,
  RegexOptions,
} from 'mongoose';
import {
  SchemaConfig,
  UniqueProperties,
  DefaultValueProperties,
  SchemaToType,
  Schema as SchemaClass,
  InferSchemaDefFromSchema,
  InferConfigfFromSchema,
} from '../schema';

export type CreateReturnWithErrors<
  Schema extends SchemaClass<any, any>,
  ReturnData,
  ModelName extends string,
> = UniqueProperties<InferSchemaDefFromSchema<Schema>> extends never
  ? ReturnData
  : ReturnData | { error: { status: 409; name: `${ModelName} already exists`; data: any } };

export type IncludeIdAndTimestampsAndDefaultProperties<
  Model,
  Schema extends SchemaClass<any, any>,
  Data = Model,
> = (InferConfigfFromSchema<Schema>['timestamps'] extends true
  ? { createdAt: Date; updatedAt: Date }
  : {}) & { _id: ObjectId } & Required<
    Pick<Model, DefaultValueProperties<InferSchemaDefFromSchema<Schema>> & keyof Model>
  > &
  Data;

export type Projection<Model> = {
  [T in keyof Model]?: NonNullable<Model[T]> extends ObjectId | Date
    ? 1
    : NonNullable<Model[T]> extends Record<any, any>
    ? 1 | Projection<Model[T]>
    : 1;
};

export type ExtractModelFromProj<Model, Proj extends Projection<Model>> = PreserverOptionalKeys<
  {
    [T in keyof Proj & keyof Model]: Proj[T] extends 1
      ? Model[T]
      : Proj[T] extends Projection<NonNullable<Model[T]>>
      ? Pretify<ExtractModelFromProj<NonNullable<Model[T]>, Proj[T]>>
      : never;
  },
  Model
>;

export type ApplyProj<Model, Proj extends Projection<Model>> = Pretify<
  { _id: ObjectId } & ExtractModelFromProj<Model, Proj>
>;

export type CompleteProj<Model> = {
  [T in keyof Required<Model>]: 1;
};

export type convertDBSchemasToDBI<DBSchemasI extends Record<string, SchemaClass<any, any>>> = {
  [ModelName in keyof DBSchemasI as Plurial<Lowercase<ModelName & string>>]: Pretify<
    IncludeIdAndTimestampsAndDefaultProperties<
      SchemaToType<InferSchemaDefFromSchema<DBSchemasI[ModelName]>>,
      DBSchemasI[ModelName]
    >
  >;
};

export type SortQuery<ModelI> = { [T in keyof ModelI]?: SortOrder };

export type FindAndUpdateOptions<Proj, FullModelI> = {
  projection?: Proj;
  session?: ClientSession;
  returnDocument?: 'before' | 'after';
  new?: boolean;
  sort?: SortQuery<FullModelI>;
  timestamps?: boolean;
  overwrite?: boolean;
};

export type FindAndDeleteOptions<Proj, FullModelI> = {
  projection?: Proj;
  session?: ClientSession;
  sort?: SortQuery<FullModelI>;
};

export type FindOneOptions = {
  session?: ClientSession;
};

export type FindOptions<FullModelI> = {
  limit?: number;
  skip?: number;
  sort?: SortQuery<FullModelI>;
  session?: ClientSession;
};

type TypeAliases =
  | 'double'
  | 'string'
  | 'object'
  | 'array'
  | 'binData'
  | 'undefined'
  | 'objectId'
  | 'bool'
  | 'date'
  | 'null'
  | 'regex'
  | 'dbPointer'
  | 'javascript'
  | 'symbol'
  | 'javascriptWithScope'
  | 'int'
  | 'timestamp'
  | 'long'
  | 'decimal'
  | 'minKey'
  | 'maxKey';

type DirectComparisonOperator = '$eq' | '$gt' | '$gte' | '$lt' | '$lte' | '$ne';
type ArrayComparisonOperator = '$in' | '$nin';

type DirectLogicalOperator = '$not';
type ArrayLogicalOperator = '$and' | '$or' | '$nor';

type DollarKeys<ModelI> = WithDollar<keyof ModelI & string>;

type MatchQueryWithExpr<ModelI> = MatchQuery<ModelI> & {
  [Operator in DirectComparisonOperator]?: [
    DollarKeys<ModelI> | `$$${string}` | ConditionalExpressionOperator,
    DollarKeys<ModelI> | `$$${string}` | ConditionalExpressionOperator | any, // To be match to a variable
  ];
};

type OnFieldOperation<Type> = Type extends Array<infer SubType>
  ?
      | OnFieldOperation<SubType>
      | { $all: Array<Type> }
      | { $elemMatch: OnFieldOperation<SubType> }
      | { $size: number }
  : Type extends number
  ?
      | number
      | ({ $not?: number; $mod?: [number, number]; $exists?: boolean; $type?: TypeAliases } & {
          [Operator in DirectComparisonOperator]?: number;
        } & {
          [Operator in ArrayComparisonOperator]?: Array<number>;
        })
  : Type extends string
  ?
      | string
      | RegExp
      | ({ $not?: string | RegExp; $exists?: boolean; $type?: TypeAliases } & {
          $regex?: RegExp | string;
          $options?: RegexOptions;
        } & {
          [Operator in '$eq' | '$ne']?: string | RegExp;
        } & {
          [Operator in ArrayComparisonOperator]?: Array<string | RegExp>;
        })
  :
      | Type
      | ({ $exists?: boolean; $type?: TypeAliases } & {
          [Operator in DirectComparisonOperator]?: Type;
        } & {
          [Operator in ArrayComparisonOperator]?: Array<Type>;
        });

type RemoveDot<Key> = Key extends `${infer OriginalKey}.${number}` ? OriginalKey : never;

export type MatchQuery<ModelI> = {
  [Key in FlatPath<ModelI>]?: OnFieldOperation<ExtractFromPath<ModelI, Key>>;
} & {
  [key in `${KeysWithValOfType<Required<ModelI>, Array<any>> & string}.${
    | number}`]?: ModelI[RemoveDot<key> & keyof ModelI] extends NonNullable<Array<infer SubType>>
    ? OnFieldOperation<SubType>
    : 'never';
} & {
  [Operator in ArrayLogicalOperator]?: Array<MatchQuery<ModelI>>;
} & {
  // EVALUATION
  $expr?: MatchQueryWithExpr<ModelI>;
  $jsonSchema?: Record<string, any>;
  $text?: {
    $search?: string;
    $language?: string;
    $caseSensitive?: boolean;
    $diacriticSensitive?: boolean;
  };
  $where?: any;
};

/**
 * TO-DO
 *
 * - [ ] Geospatial
 * - [ ] Bitwise
 * - [ ] Projection Operators
 * - [ ] Miscellaneous Operators
 */
