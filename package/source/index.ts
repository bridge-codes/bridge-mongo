import { BridgeModel } from './model';
import { isError } from './utils';
import { Schema } from './schema';

const createDB = <DBSchemasI extends Record<string, Schema<any, any>>>(
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
