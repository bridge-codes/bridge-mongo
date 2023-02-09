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
      else throw err;
    }
  };

  findOne: BridgeModelI<Name, SchemaDef, ModelI, Config, FullModelI>['findOne'] = async (
    filter,
    projection,
  ) => {
    try {
      const promise = this.mongooseModel.findOne(filter);
      const res: any = projection ? await promise.select(projection).lean() : await promise.lean();

      if (!res) return { error: { status: 404, name: 'Document not found' } };
    } catch (err) {
      return { error: { status: 404, name: `${this.modelName} not found`, data: err } } as any;
    }
  };
}

export * from './types';
export * from './utilities';
