type HttpRequest = { url: string } & (
  | {
      body?: never;
      method: 'POST';
    }
  | {
      method: 'GET';
      query: Record<string, string>;
    }
);

//https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60924#issuecomment-1504635244
declare let fetch: typeof import('undici').fetch;
