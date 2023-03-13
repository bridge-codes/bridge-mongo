import { Pretify, StricProperty, Plurial } from '../utils';
import { Types, ClientSession, UpdateQuery } from 'mongoose';
import {
  InferSchemaDefFromSchema,
  InferConfigfFromSchema,
  Schema as SchemaClass,
  DefaultValueProperties,
  SchemaToType,
} from '../schema';
import {
  CreateReturnWithErrors,
  Projection,
  CompleteProj,
  convertDBSchemasToDBI,
  FindOptions,
  ApplyProj,
  FindOneOptions,
  FindAndUpdateOptions,
  FindAndDeleteOptions,
  MatchQuery,
  IncludeIdAndTimestampsAndDefaultProperties,
} from './types';

export interface BridgeModelI<
  SchemasI extends Record<string, any>,
  ModelName extends keyof SchemasI & string,
  DBI = Pretify<convertDBSchemasToDBI<SchemasI>>,
  Schema extends SchemaClass<any, any> = SchemasI[ModelName],
  ModelI = DBI[Plurial<Lowercase<ModelName>> & keyof DBI],
> {
  create: <CreateData extends SchemaToType<InferSchemaDefFromSchema<Schema>>>(
    data: StricProperty<CreateData, ModelI>,
    options?: {
      session?: ClientSession;
    },
  ) => Promise<
    Pretify<
      CreateReturnWithErrors<
        Schema,
        IncludeIdAndTimestampsAndDefaultProperties<ModelI, Schema, CreateData>,
        ModelName
      >
    >
  >;

  find: <Proj extends Projection<Required<ModelI>> = CompleteProj<ModelI>>(
    filer: MatchQuery<ModelI>,
    proj?: Proj,
    options?: FindOptions<ModelI>,
  ) => Promise<Array<ApplyProj<ModelI, Proj>>>;

  findById: <Proj extends Projection<Required<ModelI>> = CompleteProj<ModelI>>(
    filer: string | Types.ObjectId,
    proj?: Proj,
    options?: FindOneOptions,
  ) => Promise<
    ApplyProj<ModelI, Proj> | { error: { status: 404; name: `${ModelName} not found`; data?: any } }
  >;

  findOne: <Proj extends Projection<Required<ModelI>> = CompleteProj<ModelI>>(
    filer: MatchQuery<ModelI>,
    proj?: Proj,
    options?: FindOneOptions,
  ) => Promise<
    ApplyProj<ModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findOneAndUpdate: <Proj extends Projection<Required<ModelI>> = CompleteProj<ModelI>>(
    filter: MatchQuery<ModelI>,
    // filter: FilterQuery<ModelI>,
    updateQuery: UpdateQuery<ModelI>,
    options?: FindAndUpdateOptions<Proj, ModelI>,
  ) => Promise<
    ApplyProj<ModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findByIdAndUpdate: <Proj extends Projection<Required<ModelI>> = CompleteProj<ModelI>>(
    filter: string | Types.ObjectId,
    updateQuery: UpdateQuery<ModelI>,
    options?: FindAndUpdateOptions<Proj, ModelI>,
  ) => Promise<
    ApplyProj<ModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findOneAndDelete: <Proj extends Projection<Required<ModelI>> = CompleteProj<ModelI>>(
    filter: MatchQuery<ModelI>,
    options?: FindAndDeleteOptions<Proj, ModelI>,
  ) => Promise<
    ApplyProj<ModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findByIdAndDelete: <Proj extends Projection<Required<ModelI>> = CompleteProj<ModelI>>(
    filter: string | Types.ObjectId,
    options?: FindAndDeleteOptions<Proj, ModelI>,
  ) => Promise<
    ApplyProj<ModelI, Proj> | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  exists: (filter: MatchQuery<ModelI>) => Promise<boolean>;
}
