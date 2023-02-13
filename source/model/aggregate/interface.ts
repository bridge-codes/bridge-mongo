import { convertDBSchemasToDBI, Projection, ApplyProj, MatchQuery, SortQuery } from '../types';
import { Pretify, capitalizeFirstLetter } from '../../utils';
import { PipelineStage, Model as MongooseModel, FilterQuery } from 'mongoose';
import { SchemaToType, SchemaConfig, Schema as SchemaClass } from '../../schema';

export interface AggI<
  SchemasI extends Record<string, any>,
  ModelName extends keyof SchemasI & string,
  ModelI = Pretify<convertDBSchemasToDBI<SchemasI>>[ModelName],
  DBI extends Record<keyof SchemasI, any> = Pretify<convertDBSchemasToDBI<SchemasI>>,
  Schema extends SchemaClass<any, any> = SchemasI[ModelName],
> {
  pipeline: () => PipelineStage[];

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // STAGES
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  project: <Proj extends Projection<Required<ModelI>>>(
    proj: Proj,
  ) => AggI<SchemasI, ModelName, ApplyProj<ModelI, Proj>>;

  match: (matchQuery: MatchQuery<ModelI>) => AggI<SchemasI, ModelName, ModelI>;

  sort: (sortData: SortQuery<ModelI>) => AggI<SchemasI, ModelName, ModelI>;

  limit: (limit: number) => AggI<SchemasI, ModelName, ModelI>;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EXEC
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  exec: () => Promise<ModelI[]>;

  paginate: (
    skip: number,
    limit: number,
  ) => Promise<{ data: ModelI[]; total: number; skip: number; limit: number }>;
}
