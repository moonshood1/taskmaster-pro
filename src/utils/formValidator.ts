function validate(
  values: Record<string, string>,
  rules: Record<string, (value: string) => string | null>
): { errors: Record<string, string>; isValid: boolean } {
  const errors: Record<string, string> = {};

  for (const key in rules) {
    const rule = rules[key];
    const value = values[key] || "";
    const error = rule(value);
    if (error) {
      errors[key] = error;
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { errors, isValid };
}

export default validate;
