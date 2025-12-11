import type { TemplateDefinition } from '../types/TemplateDefinition';
import { loadTemplate } from './templateLoader';

/**
 * Prosty silnik zastępujący znaczniki w tekście szablonu wartościami z obiektu data.
 * Wartości będą konwertowane do łańcuchów znaków. Daty są formatowane w trybie
 * lokalnym (pl‑PL) w formacie YYYY-MM-DD. Jeśli wartość nie istnieje, znacznik
 * zostanie zastąpiony pustym ciągiem.
 *
 * @param templateStr szablon zawierający znaczniki w formacie {{nazwa}}
 * @param data obiekt z wartościami wprowadzonymi przez użytkownika
 */
function replacePlaceholders(templateStr: string, data: Record<string, any>): string {
  return templateStr.replace(/\{\{(.*?)\}\}/g, (_match, key) => {
    const value = data[key.trim()];
    if (value === undefined || value === null) {
      return '';
    }
    // Jeśli pole jest obiektem Date lub ISO string, formatuj datę
    if (isDateLike(value)) {
      const date = new Date(value);
      return date.toISOString().split('T')[0];
    }
    return String(value);
  });
}

/**
 * Sprawdza, czy wartość jest datą lub może zostać zinterpretowana jako data.
 */
function isDateLike(value: any): boolean {
  if (value instanceof Date) return true;
  if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}/.test(value)) return true;
  return false;
}

/**
 * Generuje finalną treść uchwały na podstawie identyfikatora szablonu i danych.
 * Funkcja ładuje szablon z katalogu `templates`, a następnie zamienia
 * znaczniki na wartości z obiektu `data`.
 *
 * @param templateId identyfikator szablonu (np. "plan_finansowy")
 * @param data obiekt zawierający wartości wprowadzone przez użytkownika
 */
export function generateResolution(templateId: string, data: Record<string, any>): string {
  const templateDef = loadTemplate(templateId);
  return generateFromDefinition(templateDef, data);
}

/**
 * Generuje treść uchwały na podstawie wczytanego obiektu `TemplateDefinition`.
 * Umożliwia wielokrotne użycie bez wielokrotnego ładowania z dysku.
 *
 * @param templateDef definicja szablonu
 * @param data dane użytkownika
 */
export function generateFromDefinition(templateDef: TemplateDefinition, data: Record<string, any>): string {
  return replacePlaceholders(templateDef.template, data);
}