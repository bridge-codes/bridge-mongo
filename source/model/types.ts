import { Pretify, StricProperty, PreserverOptionalKeys } from '../utils';
import { SchemaDefinition, ObjectId, FilterQuery, SortOrder } from 'mongoose';
import { SchemaToType, SchemaConfig, DefaultValueProperties } from '../schema';
import {
  IncludeIdAndTimestamps,
  CreateReturnWithErrors,
  Projection,
  ExtractModelIFromProj,
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

  find: <Proj extends Projection<Required<FullModelI>> | undefined = undefined>(
    filer: FilterQuery<FullModelI>,
    proj?: Proj,
    options?: {
      limit?: number;
      skip?: number;
      // sort?: Proj extends undefined
      //   ? { [T in keyof FullModelI]?: SortOrder }
      //   : { [T in keyof Pretify<Proj & { _id: 1 }>]?: SortOrder };
    },
  ) => Promise<
    Array<
      Proj extends undefined
        ? FullModelI
        : Pretify<
            PreserverOptionalKeys<ExtractModelIFromProj<Required<FullModelI>, Proj>, FullModelI> & {
              _id: ObjectId;
            }
          >
    >
  >;

  findOne: <Proj extends Projection<Required<FullModelI>> | undefined = undefined>(
    filer: FilterQuery<FullModelI>,
    proj?: Proj,
  ) => Promise<
    | (Proj extends undefined
        ? FullModelI
        : Pretify<
            PreserverOptionalKeys<ExtractModelIFromProj<Required<FullModelI>, Proj>, FullModelI> & {
              _id: ObjectId;
            }
          >)
    | { error: { status: 404; name: `${ModelName} not found`; data?: any } }
  >;
}
