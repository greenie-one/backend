export function createClassInstanceWithFields<T extends object>(fieldNames: string[], instance: T, defaultValues: T): T {
  for (const fieldName of fieldNames) {
    if (fieldName in defaultValues) {
      instance[fieldName] = defaultValues[fieldName];
    } else {
      throw new Error(`Field ${fieldName} not found in class`);
    }
  }

  return instance as T;
}

export function copyFieldsFromInstance<T>(source: T, destination: T): void {
  const sourceFields = Object.keys(source);
  const destinationFields = Object.keys(destination);

  for (const field of sourceFields) {
    if (destinationFields.includes(field)) {
      destination[field] = source[field];
    } else {
      throw new Error(`Field ${field} not found in destination entity`);
    }
  }
}
