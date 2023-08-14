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

export function checkFields<T extends object>(fieldNames: string[], fromObj: T) {
  for (const fieldName of fieldNames) {
    if (!Object.hasOwn(fromObj, fieldName)) {
      throw new Error(`Field "${fieldName}" not found`);
    }
  }
}

export function copyDataFrom<T, K extends object, R>(keysFrom: T, dataFrom: K, destination: R) {
  const sourceFields = Object.keys(keysFrom);
  for (const field of sourceFields) {
    if (Object.hasOwn(dataFrom, field)) {
      destination[field] = dataFrom[field];
    }
  }
  return destination;
}
