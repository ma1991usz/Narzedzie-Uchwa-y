import type { TemplateDefinition, TemplateField } from '../types/TemplateDefinition';

/**
 * Wynik walidacji – mapowanie nazw pól na komunikaty błędów.
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Sprawdza, czy wszystkie wymagane pola w szablonie zostały uzupełnione.
 * Jeśli brak wartości lub wartość jest pusta, do wyniku dodawany jest błąd.
 * Walidacja jest bardzo podstawowa – w aplikacji produkcyjnej warto rozszerzyć
 * ją o sprawdzanie formatów (np. daty, liczby) lub specjalnych ograniczeń.
 *
 * @param template definicja szablonu z listą pól
 * @param data wartości wprowadzone przez użytkownika
 */
export function validateData(template: TemplateDefinition, data: Record<string, any>): ValidationResult {
  const errors: Record<string, string> = {};
  const isEmpty = (value: any): boolean => {
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
  };

  template.fields.forEach((field: TemplateField) => {
    if (field.required) {
      const value = data[field.name];
      if (isEmpty(value)) {
        errors[field.name] = `Pole '${field.label}' jest wymagane.`;
      }
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}