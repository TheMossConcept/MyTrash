export default function validateString(
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
