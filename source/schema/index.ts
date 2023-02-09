import { SchemaDefinition } from 'mongoose';
import { SchemaConfig } from './types';

export class Schema<
  SchemaDef extends SchemaDefinition,
  Config extends SchemaConfig = { timestamps: false },
> {
  constructor(public schemaDef: SchemaDef, public config?: Config) {}
}

export * from './types';

export type InferSchemaDefFromSchema<SchemaI extends Schema<any, any>> = SchemaI extends Schema<
  infer SchemaDef,
  any
>
  ? SchemaDef
  : never;

export type InferConfigfFromSchema<SchemaI extends Schema<any, any>> = SchemaI extends Schema<
  any,
  infer Config
>
  ? Config
  : { timestamps: false };
