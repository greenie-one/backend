type TargetMetadata = {
  method: HTTPMethods;
  url: string;
  property: string;
};

type Controllers = { constructor: import('class-transformer').ClassConstructor<unknown>; instance: object }[];

type BodyValidation = {
  type: import('class-transformer').ClassConstructor<unknown>;
  index: number;
};

type QueryValidation = {
  type: import('class-transformer').ClassConstructor<unknown>;
  index: number;
  queryName: string;
};

type HeaderValidation = {
  index: number;
  queryName: string;
};

type ParamValidation = {
  index: number;
  queryName: string;
};

type RequestValidation = {
  index: number;
};
