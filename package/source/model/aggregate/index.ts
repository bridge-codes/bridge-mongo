import { convertDBSchemasToDBI } from '../types';
import { Pretify, Plurial } from '../../utils';
import { PipelineStage, Model as MongooseModel } from 'mongoose';
import { AggI } from './interface';

export class Aggregate<
  SchemasI extends Record<string, any>,
  ModelName extends keyof SchemasI & string,
  DBI = Pretify<convertDBSchemasToDBI<SchemasI>>,
  ModelI = DBI[Plurial<Lowercase<ModelName>> & keyof DBI],
> implements AggI<SchemasI, ModelName>
{
  constructor(
    private mongoModel: MongooseModel<ModelI> = {} as any,
    private pipe: PipelineStage[] = [],
  ) {}

  /**
   * Returns the current pipeline
   */
  pipeline: AggI<SchemasI, ModelName>['pipeline'] = () => this.pipe;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // STAGES
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  project: AggI<SchemasI, ModelName>['project'] = (proj) =>
    new Aggregate(this.mongoModel, [...this.pipe, { $project: proj }]) as any;

  match: AggI<SchemasI, ModelName>['match'] = (match) =>
    new Aggregate(this.mongoModel, [...this.pipe, { $match: match as any }]) as any;

  unset: AggI<SchemasI, ModelName>['unset'] = (unset) =>
    new Aggregate(this.mongoModel, [...this.pipe, { $unset: unset as any }]) as any;

  sort: AggI<SchemasI, ModelName>['sort'] = (sort) =>
    new Aggregate(this.mongoModel, [...this.pipe, { $sort: sort } as any]) as any;

  limit: AggI<SchemasI, ModelName>['limit'] = (limit) =>
    new Aggregate(this.mongoModel, [...this.pipe, { $limit: limit } as any]) as any;

  unwind: AggI<SchemasI, ModelName>['unwind'] = (unwind) =>
    new Aggregate(this.mongoModel, [...this.pipe, { $unwind: unwind } as any]) as any;

  lookup: AggI<SchemasI, ModelName>['lookup'] = (lookupQuery: any, subAggregate?: any) => {
    if ('localField' in lookupQuery) {
      return new Aggregate(this.mongoModel, [...this.pipe, { $lookup: lookupQuery } as any]) as any;
    }

    const lookup: typeof lookupQuery & { pipeline: PipelineStage[] } = { ...lookupQuery };

    let paramLookupAggregate: any = {};

    Object.keys(lookupQuery.let || {}).forEach((key) => {
      paramLookupAggregate[key] = `$$${key}`;
    });

    lookup.pipeline = subAggregate(new Aggregate(), paramLookupAggregate).pipe;

    return new Aggregate(this.mongoModel, [...this.pipe, { $lookup: lookupQuery }]) as any;
  };

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
