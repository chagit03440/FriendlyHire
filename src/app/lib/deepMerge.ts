type Object = { [key: string]: unknown  };

const isObject = (item: unknown ): item is Object => {
  return item !== null && typeof item === "object" && !Array.isArray(item);
};
type GenericObject = { [key: string]: unknown };

/**
 * Deep merge two objects by overriding target with fields in source.
 * It returns a new object and doesn't modify any object in place since
 * it deep clones the target object first.
 */
export const deepMerge = <T extends GenericObject, U extends GenericObject>(
  target: T,
  source: U,
  level = 0
): T & U => {
  const copyTarget: GenericObject = level === 0 ? structuredClone(target) : target;

  for (const key in source) {
    const sourceValue = source[key];

    // If source value is not an object, assign it directly.
    if (!isObject(sourceValue)) {
      copyTarget[key] = sourceValue;
    } else {
      // If the target key is not an object, initialize it as an empty object.
      if (!isObject(copyTarget[key])) {
        copyTarget[key] = {};
      }
      // Recursively merge objects.
      copyTarget[key] = deepMerge(
        copyTarget[key] as GenericObject,
        sourceValue as GenericObject,
        level + 1
      );
    }
  }

  return copyTarget as T & U; // Return the merged object with combined types.
};
