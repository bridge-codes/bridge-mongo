import { BridgeModel, FullModelIGen } from './model';
import { isError } from './utils';
import { Schema, SchemaToType, InferSchemaDefFromSchema, InferConfigfFromSchema } from './schema';
import { Pretify } from './utils';

type convertDBSchemasToDBI<DBSchemasI extends Record<string, Schema<any, any>>> = {
  [T in keyof DBSchemasI]: Pretify<SchemaToType<InferSchemaDefFromSchema<DBSchemasI[T]>>>;
};

const createDB = <
  DBSchemasI extends Record<string, Schema<any, any>>,
  DBI extends convertDBSchemasToDBI<DBSchemasI>,
>(
  DBSchemas: DBSchemasI,
): {
  [ModelName in keyof DBSchemasI & string as Lowercase<ModelName>]: ModelName extends string
    ? BridgeModel<DBSchemasI, ModelName>
    : never;
} => {
  const DB: Record<string, BridgeModel<any, any>> = {};
  for (const [modelName, schema] of Object.entries(DBSchemas))
    DB[modelName] = new BridgeModel<any, any>(schema, modelName);
  return DB as any;
};

export { Schema, createDB, isError };
export * as mongoose from 'mongoose';

type test = Lowercase<string>;
