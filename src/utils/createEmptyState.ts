function createEmptyState<T extends Record<string, any>>(
  keys: (keyof T)[]
): Record<keyof T, string> {
  return keys.reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {} as Record<keyof T, string>);
}

export default createEmptyState;
