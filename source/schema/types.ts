import { Mixed } from 'mongoose';
import { Pretify } from '../utils';

export type PreserverOptionalTypes<
  New extends Record<string, any>,
  Original extends Record<string, any>,
> = Required<
  Pick<New, RequiredProperties<Original> extends keyof New ? RequiredProperties<Original> : ''>
> &
  Partial<
    Exclude<New, RequiredProperties<Original> extends keyof New ? RequiredProperties<Original> : ''>
  >;

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
  : ConstructorType extends { type: infer Type }
  ? ConstructorTypeToType<Type>
  : ConstructorType extends NumberConstructor
  ? number
  : ConstructorType extends StringConstructor
  ? string
  : ConstructorType extends DateConstructor
  ? Date
  : ConstructorType extends BooleanConstructor
  ? boolean
  : ConstructorType extends BufferConstructor
  ? Buffer
  : ConstructorType extends ObjectConstructor | Mixed
  ? any
  : ConstructorType extends Record<any, any>
  ? Pretify<
      PreserverOptionalTypes<
        {
          [T in keyof ConstructorType]: ConstructorTypeToType<ConstructorType[T]>;
        },
        ConstructorType
      >
    >
  : any; // Not handled;

export type SchemaToType<Schema extends Record<string, any>> = PreserverOptionalTypes<
  {
    [T in keyof Schema]: ConstructorTypeToType<Schema[T]>;
  },
  Schema
>;

export type SchemaConfig = { timestamps?: boolean };
