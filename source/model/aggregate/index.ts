import { convertDBSchemasToDBI } from '../types';
import { Pretify } from '../../utils';
import { PipelineStage, Model as MongooseModel } from 'mongoose';
import { Schema as SchemaClass } from '../../schema';
import { AggI } from './interface';

export class Aggregate<
  SchemasI extends Record<string, any>,
  ModelName extends keyof SchemasI & string,
  DBI extends Record<keyof SchemasI, any> = Pretify<convertDBSchemasToDBI<SchemasI>>,
  Schema extends SchemaClass<any, any> = SchemasI[ModelName],
  ModelI extends Record<keyof Schema, any> = DBI[ModelName],
> implements AggI<SchemasI, ModelName>
{
  constructor(private mongoModel: MongooseModel<ModelI>, private pipe: PipelineStage[] = []) {}

  /**
   * Returns the current pipeline
   */
  pipeline: AggI<SchemasI, ModelName>['pipeline'] = () => this.pipe;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // STAGES
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  project: AggI<SchemasI, ModelName>['project'] = () => ({} as any);

  match: AggI<SchemasI, ModelName>['match'] = () => ({} as any);

  sort: AggI<SchemasI, ModelName>['sort'] = () => ({} as any);

  limit: AggI<SchemasI, ModelName>['limit'] = () => ({} as any);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EXEC
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Executes the aggregate pipeline on the currently bound Model
   */
  exec: AggI<SchemasI, ModelName>['exec'] = async () => {
    if (this.pipe.length === 0)
      throw new Error(
        `You can't use exec on an empty aggregate pipeline. Add some stages or use the paginate function to act like a find mongoose method.`,
      );
    return await this.mongoModel.aggregate(this.pipe);
  };

  /**
   * Executes the aggregate pipeline on the currently bound Model by paginating the results
   *
   * @param1 skip
   * @param2 limit
   */
  paginate: AggI<SchemasI, ModelName>['paginate'] = async (skip, limit) => {
    this.pipe.push({
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    });

    const res = await this.mongoModel.aggregate(this.pipe);

    return {
      data: res[0].data,
      total: res[0].metadata[0]?.total || 0,
      skip,
      limit,
    };
  };
}

type zh = Lowercase<'Ahh'>;
