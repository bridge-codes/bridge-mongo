import { Pretify } from '../utils';
import { ObjectId, SchemaDefinition } from 'mongoose';
import { SchemaConfig, UniqueProperties, DefaultValueProperties, SchemaToType } from '../schema';

export type CreateReturnWithErrors<
  Schema extends Record<string, any>,
  ReturnData,
  ModelName extends string,
> = UniqueProperties<Schema> extends never
  ? ReturnData
  : ReturnData | { error: { status: 409; name: `${ModelName} already exists`; data: any } };

export type IncludeIdAndTimestamps<
  Data,
  Config extends SchemaConfig,
> = Config['timestamps'] extends true
  ? { _id: ObjectId; createdAt: Date; updatedAt: Date } & Data
  : { _id: ObjectId } & Data;

export type Projection<Model> = {
  [T in keyof Model]?: Model[T] extends ObjectId | Date
    ? 1
    : Model[T] extends Record<any, any>
    ? 1 | Projection<Model[T]>
    : 1;
};

export type ExtractModelIFromProj<Model, Proj extends Projection<Model> | undefined> = {
  [T in keyof Proj & keyof Model]: Proj[T] extends 1
    ? Model[T]
    : Proj[T] extends Projection<Model[T]>
    ? Pretify<ExtractModelIFromProj<Model[T], Proj[T]>>
    : never;
};

export type FullModelIGen<
  ModelI extends Pretify<SchemaToType<SchemaDef>>,
  SchemaDef extends SchemaDefinition,
  Config extends SchemaConfig,
> = Pretify<
  IncludeIdAndTimestamps<ModelI & Required<Pick<ModelI, DefaultValueProperties<SchemaDef>>>, Config>
>;
