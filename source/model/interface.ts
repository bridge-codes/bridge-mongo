import { Pretify, StricProperty, PreserverOptionalKeys } from '../utils';
import { ObjectId, FilterQuery, ClientSession, UpdateQuery } from 'mongoose';
import {
  SchemaConfig,
  DefaultValueProperties,
  InferSchemaDefFromSchema,
  InferConfigfFromSchema,
  Schema as SchemaClass,
} from '../schema';
import {
  IncludeIdAndTimestamps,
  CreateReturnWithErrors,
  Projection,
  CompleteProj,
  convertDBSchemasToDBI,
  FindOptions,
  ApplyProj,
  FindOneOptions,
  FindAndUpdateOptions,
  FindAndDeleteOptions,
} from './types';

export interface BridgeModelI<
  SchemasI extends Record<string, SchemaClass<any, any>>,
  ModelName extends keyof SchemasI & string,
  DBI extends Record<keyof SchemasI, any> = convertDBSchemasToDBI<SchemasI>,
  Schema extends SchemaClass<any, any> = SchemasI[ModelName],
  ModelI extends Record<keyof SchemaDef, any> = DBI[ModelName],
  Config extends SchemaConfig = InferConfigfFromSchema<Schema>,
  SchemaDef extends Record<string, any> = InferSchemaDefFromSchema<Schema>,
  FullModelI = Pretify<
    IncludeIdAndTimestamps<
      ModelI & Required<Pick<ModelI, DefaultValueProperties<SchemaDef>>>,
      Config
    >
  >,
> {
  create: <CreateData extends ModelI>(
    data: StricProperty<CreateData, ModelI>,
    options?: {
      session?: ClientSession;
    },
  ) => Promise<
    Pretify<
      CreateReturnWithErrors<
        SchemaDef,
        IncludeIdAndTimestamps<
          CreateData & Required<Pick<ModelI, DefaultValueProperties<SchemaDef>>>,
          Config
        >,
        ModelName
      >
    >
  >;

  find: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filer: FilterQuery<FullModelI>,
    proj?: Proj,
    options?: FindOptions<FullModelI>,
  ) => Promise<Array<ApplyProj<FullModelI, Proj>>>;

  findById: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filer: string | ObjectId,
    proj?: Proj,
    options?: FindOneOptions,
  ) => Promise<
    | ApplyProj<FullModelI, Proj>
    | { error: { status: 404; name: `${ModelName} not found`; data?: any } }
  >;

  findOne: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filer: FilterQuery<FullModelI>,
    proj?: Proj,
    options?: FindOneOptions,
  ) => Promise<
    ApplyProj<FullModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findOneAndUpdate: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filter: FilterQuery<FullModelI>,
    updateQuery: UpdateQuery<ModelI>,
    options?: FindAndUpdateOptions<Proj, FullModelI>,
  ) => Promise<
    ApplyProj<FullModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findByIdAndUpdate: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filter: string | ObjectId,
    updateQuery: UpdateQuery<ModelI>,
    options?: FindAndUpdateOptions<Proj, FullModelI>,
  ) => Promise<
    ApplyProj<FullModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findOneAndDelete: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filter: FilterQuery<FullModelI>,
    options?: FindAndDeleteOptions<Proj, FullModelI>,
  ) => Promise<
    ApplyProj<FullModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findByIdAndDelete: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filter: string | ObjectId,
    options?: FindAndDeleteOptions<Proj, FullModelI>,
  ) => Promise<
    ApplyProj<FullModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;
}
