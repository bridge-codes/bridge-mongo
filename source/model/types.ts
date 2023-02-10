import { Pretify, StricProperty, PreserverOptionalKeys } from '../utils';
import {
  SchemaDefinition,
  ObjectId,
  FilterQuery,
  SortOrder,
  ClientSession,
  UpdateQuery,
} from 'mongoose';
import { SchemaToType, SchemaConfig, DefaultValueProperties } from '../schema';
import {
  IncludeIdAndTimestamps,
  CreateReturnWithErrors,
  Projection,
  ExtractModelIFromProj,
  CompleteProj,
} from './utilities';

export interface BridgeModelI<
  ModelName extends string,
  SchemaDef extends SchemaDefinition,
  ModelI extends Pretify<SchemaToType<SchemaDef>>,
  Config extends SchemaConfig,
  FullModelI extends Pretify<
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
    options?: {
      limit?: number;
      skip?: number;
      sort?: { [T in keyof FullModelI]?: SortOrder };
      session?: ClientSession;
    },
  ) => Promise<
    Array<
      Pretify<
        PreserverOptionalKeys<ExtractModelIFromProj<Required<FullModelI>, Proj>, FullModelI> & {
          _id: ObjectId;
        }
      >
    >
  >;

  findById: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filer: string | ObjectId,
    proj?: Proj,
    options?: {
      session?: ClientSession;
    },
  ) => Promise<
    | Pretify<
        PreserverOptionalKeys<ExtractModelIFromProj<Required<FullModelI>, Proj>, FullModelI> & {
          _id: ObjectId;
        }
      >
    | { error: { status: 404; name: `${ModelName} not found`; data?: any } }
  >;

  findOne: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filer: FilterQuery<FullModelI>,
    proj?: Proj,
    options?: {
      session?: ClientSession;
    },
  ) => Promise<
    | Pretify<
        PreserverOptionalKeys<ExtractModelIFromProj<Required<FullModelI>, Proj>, FullModelI> & {
          _id: ObjectId;
        }
      >
    | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findOneAndUpdate: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filter: FilterQuery<FullModelI>,
    updateQuery: UpdateQuery<ModelI>,
    options?: {
      projection?: Proj;
      session?: ClientSession;
      returnDocument?: 'before' | 'after';
      new?: boolean;
      sort?: { [T in keyof FullModelI]?: SortOrder };
      timestamps?: boolean;
      overwrite?: boolean;
    },
  ) => Promise<
    | Pretify<
        PreserverOptionalKeys<ExtractModelIFromProj<Required<FullModelI>, Proj>, FullModelI> & {
          _id: ObjectId;
        }
      >
    | { error: { status: 404; name: `${ModelName} not found` } }
  >;

  findByIdAndUpdate: <Proj extends Projection<Required<FullModelI>> = CompleteProj<FullModelI>>(
    filter: string | ObjectId,
    updateQuery: UpdateQuery<ModelI>,
    options?: {
      projection?: Proj;
      session?: ClientSession;
      returnDocument?: 'before' | 'after';
      new?: boolean;
      sort?: { [T in keyof FullModelI]?: SortOrder };
      timestamps?: boolean;
      overwrite?: boolean;
    },
  ) => Promise<
    | Pretify<
        PreserverOptionalKeys<ExtractModelIFromProj<Required<FullModelI>, Proj>, FullModelI> & {
          _id: ObjectId;
        }
      >
    | { error: { status: 404; name: `${ModelName} not found` } }
  >;
}
