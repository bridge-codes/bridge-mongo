import { BridgeModelI } from './types';
import { FullModelIGen } from './utilities';
import { Pretify, capitalizeFirstLetter } from '../utils';
import {
  SchemaDefinition,
  Model as MongooseModel,
  model as createMongooseModel,
  Schema as MongooseSchema,
} from 'mongoose';
import { SchemaToType, SchemaConfig, Schema, DefaultValueProperties } from '../schema';

export class BridgeModel<
  Name extends string,
  SchemaDef extends SchemaDefinition,
  ModelI extends Pretify<SchemaToType<SchemaDef>>,
  Config extends SchemaConfig,
  FullModelI extends FullModelIGen<ModelI, SchemaDef, Config>,
> implements BridgeModelI<Name, SchemaDef, ModelI, Config, FullModelI>
{
  private modelName: string;

  public modelInterface!: ModelI;
  public configInterface!: Config;

  public mongooseModel: MongooseModel<ModelI>;

  constructor(modelName: Name, schema: Schema<SchemaDef, SchemaConfig>) {
    this.modelName = capitalizeFirstLetter(modelName);

    const mongooseSchema = new MongooseSchema(
      schema.schemaDef,
      schema.config || { timestamps: false },
    );
    this.mongooseModel = createMongooseModel<ModelI>(modelName, mongooseSchema);
  }

  create: BridgeModelI<Name, SchemaDef, ModelI, Config, FullModelI>['create'] = async (data) => {
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

  find: BridgeModelI<Name, SchemaDef, ModelI, Config, FullModelI>['find'] = async (
    filter,
    projection,
    options,
  ) => {
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

  findById: BridgeModelI<Name, SchemaDef, ModelI, Config, FullModelI>['findById'] = async (
    filter,
    projection,
    options,
  ) => {
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

  findOne: BridgeModelI<Name, SchemaDef, ModelI, Config, FullModelI>['findOne'] = async (
    filter,
    projection,
    options,
  ) => {
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

  findOneAndUpdate: BridgeModelI<Name, SchemaDef, ModelI, Config, FullModelI>['findOneAndUpdate'] =
    async (filter, updateQuery, options) => {
      try {
        const res: any = await this.mongooseModel.findOneAndUpdate(filter, updateQuery, {
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

  findByIdAndUpdate: BridgeModelI<
    Name,
    SchemaDef,
    ModelI,
    Config,
    FullModelI
  >['findByIdAndUpdate'] = async (filter, updateQuery, options) => {
    try {
      const res: any = await this.mongooseModel.findByIdAndUpdate(filter, updateQuery, {
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
}

export * from './types';
export * from './utilities';
