import { BridgeModelI } from './interface';
import { convertDBSchemasToDBI } from './types';
import { Pretify } from '../utils';
import {
  Model as MongooseModel,
  model as createMongooseModel,
  Schema as MongooseSchema,
} from 'mongoose';
import { Aggregate } from './aggregate';
import { Schema as SchemaClass } from '../schema';

export class BridgeModel<
  SchemasI extends Record<string, any>,
  ModelName extends keyof SchemasI & string,
  DBI extends Record<keyof SchemasI, any> = Pretify<convertDBSchemasToDBI<SchemasI>>,
  Schema extends SchemaClass<any, any> = SchemasI[ModelName],
  ModelI extends Record<keyof Schema, any> = DBI[ModelName],
> implements BridgeModelI<SchemasI, ModelName>
{
  public mongooseModel: MongooseModel<ModelI>;

  public modelInterface!: ModelI;

  constructor(schema: Schema, public modelName: ModelName) {
    const mongooseSchema = new MongooseSchema(
      schema.schemaDef,
      schema.config || { timestamps: false },
    );
    this.mongooseModel = createMongooseModel<ModelI>(modelName, mongooseSchema);
  }

  public aggregate = () =>
    new Aggregate<SchemasI, ModelName, DBI, Schema, ModelI>(this.mongooseModel);

  create: BridgeModelI<SchemasI, ModelName>['create'] = async (data) => {
    try {
      return ((await this.mongooseModel.create([data])) as any)[0].toJSON();
    } catch (err: any) {
      if (err.code === 11000)
        return {
          error: { status: 409, name: `${this.modelName} already exists`, data: err.keyValue },
        };
      // Should we handle some other errors here ?
      else throw err;
    }
  };

  find: BridgeModelI<SchemasI, ModelName>['find'] = async (filter, projection, options) => {
    try {
      return await this.mongooseModel.find(filter, projection || undefined, {
        lean: true,
        ...(options || {}),
      });
    } catch (err: any) {
      // Should we handle some errors here ?
      throw err;
    }
  };

  findById: BridgeModelI<SchemasI, ModelName>['findById'] = async (filter, projection, options) => {
    try {
      const res: any = await this.mongooseModel.findById(filter, projection || undefined, {
        lean: true,
        ...(options || {}),
      });
      if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
      return res;
    } catch (err) {
      // Should we handle some errors here ?
      throw err;
    }
  };

  findOne: BridgeModelI<SchemasI, ModelName>['findOne'] = async (filter, projection, options) => {
    try {
      const res: any = await this.mongooseModel.findOne(filter, projection || undefined, {
        lean: true,
        ...(options || {}),
      });
      if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
      return res;
    } catch (err) {
      // Should we handle some errors here ?
      throw err;
    }
  };

  findOneAndUpdate: BridgeModelI<SchemasI, ModelName>['findOneAndUpdate'] = async (
    filter,
    updateQuery,
    options,
  ) => {
    try {
      const res: any = await (this.mongooseModel as any).findOneAndUpdate(filter, updateQuery, {
        lean: true,
        ...options,
      });
      if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
      return res;
    } catch (err) {
      // Should we handle some errors here ?
      throw err;
    }
  };

  findByIdAndUpdate: BridgeModelI<SchemasI, ModelName>['findByIdAndUpdate'] = async (
    filter,
    updateQuery,
    options,
  ) => {
    try {
      const res: any = await (this.mongooseModel as any).findByIdAndUpdate(filter, updateQuery, {
        lean: true,
        ...options,
      });
      if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
      return res;
    } catch (err) {
      // Should we handle some errors here ?
      throw err;
    }
  };

  findOneAndDelete: BridgeModelI<SchemasI, ModelName>['findOneAndDelete'] = async (
    filter,
    options,
  ) => {
    try {
      const res: any = await this.mongooseModel.findOneAndDelete(filter, options);
      if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
      return res;
    } catch (err) {
      // Should we handle some errors here ?
      throw err;
    }
  };

  findByIdAndDelete: BridgeModelI<SchemasI, ModelName>['findByIdAndDelete'] = async (
    filter,
    options,
  ) => {
    try {
      const res: any = await this.mongooseModel.findByIdAndDelete(filter, options);
      if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
      return res;
    } catch (err) {
      // Should we handle some errors here ?
      throw err;
    }
  };
}

export * from './old';
export * from './types';
