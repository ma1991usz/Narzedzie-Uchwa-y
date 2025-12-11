/*
 * Przykładowy endpoint API do generowania treści uchwał w aplikacji Next.js.
 * Endpoint oczekuje zapytania POST z parametrami `templateId` (identyfikator
 * szablonu) i `data` (obiekt z wartościami pól). W odpowiedzi zwraca
 * wygenerowany tekst uchwały lub listę błędów walidacji.
 */

type ApiRequest = {
  method?: string;
  body?: any;
};
type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: any) => ApiResponse;
};
import { loadTemplate } from '../utils/templateLoader';
import { generateFromDefinition } from '../utils/resolutionGenerator';
import { validateData } from '../utils/validation';

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Metoda niedozwolona' });
  }

  const { templateId, data } = req.body ?? {};
  if (!templateId || typeof templateId !== 'string') {
    return res.status(400).json({ message: 'Brak identyfikatora szablonu' });
  }
  if (typeof data !== 'object' || data === null) {
    return res.status(400).json({ message: 'Brak danych formularza' });
  }
  try {
    const template = loadTemplate(templateId);
    const validation = validateData(template, data);
    if (!validation.valid) {
      return res.status(422).json({ errors: validation.errors });
    }
    const result = generateFromDefinition(template, data);
    return res.status(200).json({ content: result });
  } catch (error) {
    console.error('Błąd generowania uchwały:', error);
    return res.status(500).json({ message: 'Wystąpił błąd serwera' });
  }
}
