type HttpRequest = {
  url: string;
  headers?:
    | {
        'Content-Type'?: 'application/json' | 'application/x-www-form-urlencoded';
      } & Record<string, string>;
  toJSON?: boolean;
} & (
  | {
      body?: Record<string, string | string[] | number | boolean>;
      method: 'POST';
    }
  | {
      method: 'GET';
      query?: Record<string, string>;
    }
);

//https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60924#issuecomment-1504635244
declare let fetch: typeof import('undici').fetch;
