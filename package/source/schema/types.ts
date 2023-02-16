import { Decimal128, Mixed, ObjectId } from 'mongoose';
import { Pretify } from '../utils';

type PreserverOptionalTypesFromShema<
  New extends Record<string, any>,
  Original extends Record<string, any>,
> = Required<Pick<New, RequiredProperties<Original> & keyof New>> &
  Partial<Exclude<New, RequiredProperties<Original> & keyof New>>;

export type UniqueProperties<T extends Record<string, any>> = {
  [P in keyof T]: T[P] extends { unique: true } ? P : never;
}[keyof T];

export type RequiredProperties<T extends Record<string, any>> = {
  [P in keyof T]: T[P] extends { required: true } ? P : never;
}[keyof T];

export type DefaultValueProperties<T extends Record<string, any>> = {
  [P in keyof T]: T[P] extends { default: any } ? P : never;
}[keyof T];

type ConstructorTypeToType<ConstructorType> = ConstructorType extends Array<infer Type>
  ? Array<ConstructorTypeToType<Type>>
  : ConstructorType extends { enum: readonly (infer EnumType)[] }
  ? EnumType
  : ConstructorType extends { type: infer Type }
  ? ConstructorTypeToType<Type>
  : ConstructorType extends NumberConstructor
  ? number
  : ConstructorType extends Decimal128
  ? number
  : ConstructorType extends StringConstructor
  ? string
  : ConstructorType extends DateConstructor
  ? Date
  : ConstructorType extends BooleanConstructor
  ? boolean
  : ConstructorType extends BufferConstructor
  ? Buffer
  : ConstructorType extends { prototype?: { _bsontype?: any } }
  ? ObjectId
  : ConstructorType extends ObjectConstructor | Mixed
  ? any
  : ConstructorType extends Record<any, any>
  ? Pretify<
      PreserverOptionalTypesFromShema<
        {
          [T in keyof ConstructorType]: Exclude<
            ConstructorTypeToType<ConstructorType[T]>,
            undefined
          >;
        },
        ConstructorType
      >
    >
  : any; // Not handled;

export type SchemaToType<Schema extends Record<string, any>> = PreserverOptionalTypesFromShema<
  {
    [T in keyof Schema]: Exclude<ConstructorTypeToType<Schema[T]>, undefined>;
  },
  Schema
>;

export type SchemaConfig = { timestamps?: boolean };
