interface BridgeError {
  error: {
    status: number;
    name: string;
  };
}

export const isBridgeError = (object: any): object is Error =>
  typeof object === 'object' &&
  typeof object.error === 'object' &&
  typeof object.error.name === 'string' &&
  typeof object.error.status === 'number';

export const isError = (object: any): object is BridgeError =>
  typeof object === 'object' && isBridgeError(object.error);
