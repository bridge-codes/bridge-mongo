import { BridgeModel, FullModelIGen } from './model';
import { isError } from './utils';
import { Schema, SchemaToType, InferSchemaDefFromSchema, InferConfigfFromSchema } from './schema';
import { Pretify } from './utils';

const createDB = <DBSchemasI extends Record<string, Schema<any, any>>>(
  DBSchema: DBSchemasI,
): {
  [T in keyof DBSchemasI]: T extends string
    ? BridgeModel<
        Capitalize<T>,
        InferSchemaDefFromSchema<DBSchemasI[T]>,
        Pretify<SchemaToType<InferSchemaDefFromSchema<DBSchemasI[T]>>>,
        InferConfigfFromSchema<DBSchemasI[T]>,
        FullModelIGen<
          Pretify<SchemaToType<InferSchemaDefFromSchema<DBSchemasI[T]>>>,
          InferSchemaDefFromSchema<DBSchemasI[T]>,
          InferConfigfFromSchema<DBSchemasI[T]>
        >
      >
    : never;
} => {
  const DB: Record<string, BridgeModel<any, any, any, any, any>> = {};

  for (const [modelName, schema] of Object.entries(DBSchema))
    DB[modelName] = new BridgeModel(modelName, schema);

  return DB as any;
};

export { Schema, createDB, isError };
export * as mongoose from 'mongoose';
