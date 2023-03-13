import { Types } from 'mongoose';

export type Pretify<T> = {
  [K in keyof T]: T[K];
} & {};

export type StricProperty<T, M> = Exclude<keyof T, keyof M> extends never
  ? T
  : 'Error: Only strict properties allowed';

// export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
// export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

type KeysValNotNever<T> = keyof {
  [key in keyof T as T[key] extends never ? never : key]: 1;
};

export type OptionalKeys<T> = KeysValNotNever<{
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}>;
export type RequiredKeys<T> = KeysValNotNever<{
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}>;

export type PreserverOptionalKeys<New, Old> = Required<Pick<New, keyof New & RequiredKeys<Old>>> &
  Partial<Pick<New, keyof New & OptionalKeys<Old>>>;

// export type KeysWithValsOfType<T, V> = keyof { [P in keyof T as T[P] extends V ? P : never]: P };
export type KeysWithValOfType<Model, Type> = keyof {
  [key in keyof Model as Model[key] extends Type | undefined ? key : never]: 1;
};

export type WithDollar<T extends string> = `$${T}`;

type IsAny<T> = unknown extends T ? ([keyof T] extends [never] ? false : true) : false;

export type FlatPath<T> = keyof {
  [key in keyof Required<T> as NonNullable<T[key]> extends Record<any, any>
    ? Required<T>[key] extends Array<any>
      ? never
      : Required<T>[key] extends Date | Types.ObjectId | Buffer
      ? key
      : IsAny<Required<T>[key]> extends true
      ? key
      : `${key extends string ? key : ''}.${FlatPath<Required<T>[key]> extends string
          ? FlatPath<Required<T>[key]>
          : ''}`
    : keyof Required<T>]: 1;
};

export type ExtractFromPath<
  Obj extends any,
  Path extends FlatPath<Obj>,
> = Path extends `${infer A}.${infer B}`
  ? A extends keyof Required<Obj>
    ? B extends FlatPath<Required<Obj>[A]>
      ? ExtractFromPath<Required<Obj>[A], B>
      : never
    : never
  : Path extends keyof Required<Obj>
  ? Required<Obj>[Path]
  : never;

export type Plurial<T extends string> = T extends `${string}${'s' | 'sh' | 'ch' | 'x' | 'z'}`
  ? `${T}es`
  : `${T}s`;
