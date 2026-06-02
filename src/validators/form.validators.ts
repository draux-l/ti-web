export function isDNI(value: string): boolean {
  return /^\d{8}$/.test(value)
}

export function isName(value: string): boolean {
  return /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(value)
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isMinLength(value: string, min: number): boolean {
  return value.length >= min
}

export function isAlphaNumeric(value: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(value)
}

export function isCourseName(value: string): boolean {
  return /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s-]+$/.test(value)
}
