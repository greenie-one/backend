type TargetMetadata = {
  method: HTTPMethods;
  url: string;
  property: string;
};

type Controllers = { constructor: import('class-transformer').ClassConstructor; instance: object }[];
