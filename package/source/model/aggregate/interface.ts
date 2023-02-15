import { convertDBSchemasToDBI, Projection, ApplyProj, MatchQuery, SortQuery } from '../types';
import { Pretify, Plurial, KeysWithValOfType } from '../../utils';
import { PipelineStage } from 'mongoose';

// DBILP stands for DB Interface Plurial Lowercase

export interface AggI<
  SchemasI extends Record<string, any>,
  ModelName extends keyof SchemasI & string,
  ModelI = convertDBSchemasToDBI<SchemasI>[Plurial<Lowercase<ModelName>> &
    keyof convertDBSchemasToDBI<SchemasI>],
  DBI = Pretify<convertDBSchemasToDBI<SchemasI>>,
> {
  pipeline: () => PipelineStage[];

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // STAGES
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  project: <Proj extends Projection<ModelI>>(
    proj: Proj,
  ) => AggI<SchemasI, ModelName, ApplyProj<ModelI, Proj>>;

  match: (matchQuery: MatchQuery<ModelI>) => AggI<SchemasI, ModelName, ModelI>;

  /**
   * TO-DO:
   * - [ ] Add nested unset
   */
  unset: <UnsetQuery extends Array<keyof ModelI> | keyof ModelI>(
    unsetQuery: UnsetQuery,
  ) => AggI<
    SchemasI,
    ModelName,
    {
      [key in Exclude<
        keyof ModelI,
        UnsetQuery extends Array<any> ? UnsetQuery[number] : UnsetQuery
      >]: ModelI[key];
    }
  >;

  sort: (sortData: SortQuery<ModelI>) => AggI<SchemasI, ModelName, ModelI>;

  limit: (limit: number) => AggI<SchemasI, ModelName, ModelI>;

  lookup<
    From extends keyof DBI & string,
    LocalField extends keyof ModelI,
    ForeignField extends KeysWithValOfType<DBI[From], ModelI[LocalField]>,
    AS extends string = From,
  >(lookupQuery: {
    from: From;
    as?: AS;
    localField: LocalField;
    foreignField: ForeignField;
  }): AggI<SchemasI, ModelName, ModelI & { [P in AS]: DBI[From][] }>;

  lookup<
    From extends keyof DBI & string,
    Let extends Record<string, `$${keyof ModelI & string}`>,
    NewModel,
    AS extends string = From,
  >(
    lookupQuery: {
      from: From;
      as?: AS;
      let?: Let;
    },
    subPipeline: (
      p1: AggI<SchemasI, ModelName, DBI[From]>,
      p2: { [key in keyof Let]: `$$${key & string}` },
    ) => AggI<SchemasI, ModelName, NewModel>,
  ): AggI<SchemasI, ModelName, ModelI & { [P in AS]: NewModel[] }>;

  unwind<
    KeyOfArrayToUnwind extends KeysWithValOfType<ModelI, Array<any>> & string,
    PreserveNull extends boolean = false,
    IncludeArrayIndex extends string = '',
  >(
    p:
      | {
          path: `$${KeyOfArrayToUnwind}`;
          preserveNullAndEmptyArrays?: PreserveNull;
          includeArrayIndex?: IncludeArrayIndex;
        }
      | `$${KeyOfArrayToUnwind}`,
  ): AggI<
    SchemasI,
    ModelName,
    Pretify<
      {
        [key in keyof ModelI]: key extends KeyOfArrayToUnwind
          ? ModelI[key] extends Array<infer Type>
            ? PreserveNull extends true
              ? Type | undefined
              : Type
            : never
          : ModelI[key];
      } & { [Key in Exclude<IncludeArrayIndex, ''>]: number }
    >
  >;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EXEC
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  exec: () => Promise<ModelI[]>;

  paginate: (
    skip: number,
    limit: number,
  ) => Promise<{ data: ModelI[]; total: number; skip: number; limit: number }>;
}

const add = <P1 extends string, P2 extends string>(p1: P1, p2: P2): `${P1}-${P2}` => `${p1}-${p2}`;

const res = add('A', 'b');

console.log(res);
