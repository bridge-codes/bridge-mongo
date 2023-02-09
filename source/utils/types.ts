export type Pretify<T> = {
  [K in keyof T]: T[K];
} & {};

export type StricProperty<T, M> = Exclude<keyof T, keyof M> extends never
  ? T
  : 'Error: Only strict properties allowed';

export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

export type PreserverOptionalKeys<New, Old> = Required<Pick<New, keyof New & RequiredKeys<Old>>> &
  Partial<Pick<New, keyof New & OptionalKeys<Old>>>;
