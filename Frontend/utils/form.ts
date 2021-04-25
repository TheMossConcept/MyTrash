export function validateString(
  newValue: string | null,
  regexp: RegExp,
  isOptional?: boolean
): ValidationResult {
  if (newValue === "" || newValue === null) {
    if (isOptional) {
      return ValidationResult.success;
    }

    return ValidationResult.missing;
  }

  // Only pass the value up the component chain if it is valid
  if (regexp.test(newValue)) {
    return ValidationResult.success;
  }

  return ValidationResult.invalid;
}

export enum ValidationResult {
  "success",
  "missing",
  "invalid",
}

export function setValue<T>(formState: [T, (newValue: T) => void]) {
  return (key: keyof T) => {
    return (value: string | number | boolean | undefined) => {
      const [formData, setFormData] = formState;
      // Update the value if it has changed
      setFormData({ ...formData, [key]: value });
    };
  };
}
