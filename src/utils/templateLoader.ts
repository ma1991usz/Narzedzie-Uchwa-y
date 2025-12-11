import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { TemplateDefinition } from '../types/TemplateDefinition';

/**
 * Ścieżka do katalogu z plikami szablonów. Używa `__dirname` aby działać
 * zarówno w środowisku Node jak i przy bundlowaniu (Webpack/Next.js).
 */
const templatesDir = join(__dirname, '..', '..', 'templates');

/**
 * Wczytuje definicję szablonu na podstawie jego identyfikatora.
 * Plik szablonu musi znajdować się w katalogu `templates` i mieć nazwę
 * odpowiadającą identyfikatorowi (np. `plan_finansowy.json`).
 *
 * @param id identyfikator szablonu
 * @returns obiekt TemplateDefinition
 * @throws jeśli plik nie istnieje lub nie jest prawidłowym JSON-em
 */
export function loadTemplate(id: string): TemplateDefinition {
  const fileName = `${id}.json`;
  const filePath = join(templatesDir, fileName);
  try {
    const contents = readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(contents) as TemplateDefinition;
    return parsed;
  } catch (err) {
    throw new Error(`Nie można wczytać szablonu '${id}': ${err}`);
  }
}

/**
 * Zwraca listę dostępnych szablonów (identyfikatory). Przydatne do
 * generowania listy w panelu wyboru typu uchwały.
 */
export function listTemplates(): string[] {
  const files = readdirSync(templatesDir);
  return files
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}