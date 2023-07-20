export function createClassInstanceWithFields<T extends object>(fieldNames: string[], instance: T, defaultValues: T): T {
  for (const fieldName of fieldNames) {
    if (fieldName in defaultValues) {
      instance[fieldName] = defaultValues[fieldName];
    } else {
      throw new Error(`Field "${fieldName}" not found or not allowed in DTO`);
    }
  }

  return instance as T;
}

export function copyFieldsFromInstance<T extends object>(source: T, destination: T) {
  const sourceFields = Object.keys(source);
  for (const field of sourceFields) {
    if (destination.hasOwnProperty(field)) {
      destination[field] = source[field];
    }
  }
}

export function copyDataFromInstance<T, K, R>(source: T, dataFrom: K, dataInto: R) {
  const sourceFields = Object.keys(source);
  for (const field of sourceFields) {
    if (dataFrom.hasOwnProperty(field)) {
      dataInto[field] = dataFrom[field];
    }
  }
  return dataInto;
}
