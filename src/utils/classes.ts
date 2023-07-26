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

export function pickFields<T extends object, K>(fieldNames: string[], fromObj: T, toObj: K): K {
  for (const fieldName of fieldNames) {
    if (fieldName in fromObj) {
      toObj[fieldName] = fromObj[fieldName];
    } else {
      throw new Error(`Field "${fieldName}" not found`);
    }
  }

  return toObj as K;
}

export function checkFields<T extends object>(fieldNames: string[], fromObj: T) {
  for (const fieldName of fieldNames) {
    if (!Object.hasOwn(fromObj, fieldName)) {
      throw new Error(`Field "${fieldName}" not found`);
    }
  }
}

export function copyFieldsFromInstance<T extends object>(source: T, destination: T) {
  const sourceFields = Object.keys(source);
  for (const field of sourceFields) {
    if (Object.hasOwn(destination, field)) {
      destination[field] = source[field];
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

export function copySourceDataWithKeysFrom<T, K extends object, R>(source: T, keysFrom: K, destination: R) {
  const sourceFields = Object.keys(source);
  for (const field of sourceFields) {
    if (Object.hasOwn(keysFrom, field)) {
      destination[field] = source[field];
    }
  }
  return destination;
}
