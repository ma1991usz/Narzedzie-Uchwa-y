# Tworzenie treści – generator uchwał Wspólnoty Mieszkaniowej

Ten projekt udostępnia moduł do generowania treści uchwał wspólnot mieszkaniowych zgodnie z przepisami ustawy o własności lokali. Moduł może zostać zintegrowany z istniejącym portalem (np. opartym o React/Next.js) w celu uproszczenia przygotowywania i publikacji uchwał. Zamiast ręcznie redagować każdą uchwałę, użytkownik wypełnia dynamiczny formularz, a system tworzy treść na podstawie szablonów.

## Założenia

* **Zgodność z prawem –** treść uchwał jest oparta na przepisach ustawy o własności lokali. Ustawa wymaga m.in. aby uchwały właścicieli lokali były podejmowane większością głosów według udziałów, chyba że umowa lub uchwała stanowi inaczej【729216983981508†L51-L63】. W razie braku wymaganej większości zarząd może wystąpić do sądu【557045558965318†L49-L56】. Właściciel może również zaskarżyć uchwałę niezgodną z przepisami prawa lub naruszającą jego interesy w terminie 6 tygodni【9308900295†L51-L63】. Moduł udostępnia jedynie szablony – decyzje o przyjęciu uchwały oraz jej ostatecznym brzmieniu powinny być konsultowane z zarządem i dostosowywane do przepisów oraz umowy wspólnoty.
* **Szablony uchwał** znajdują się w katalogu `templates`. Każdy szablon opisany jest w pliku JSON zawierającym listę pól formularza oraz tekst uchwały z wstawionymi znacznikami (placeholderami) w formacie `{{nazwaPola}}`. Dzięki temu łatwo dodać nowe typy uchwał lub edytować istniejące bez ingerencji w kod.
* **Warstwa logiki** znajduje się w katalogu `src`. Główna funkcja `generateResolution` pobiera identyfikator szablonu i dane wprowadzone przez użytkownika, wczytuje odpowiedni szablon i zastępuje znaczniki wartościami, generując finalny tekst uchwały. W module uwzględniono podstawową walidację wymaganych pól.
* **Warstwa API** (katalog `src/api`) zawiera przykładowy plik `generate.ts` będący funkcją API zgodną z konwencją Next.js. Przyjmuje dane formularza w formacie JSON i zwraca wygenerowaną treść uchwały. Jeśli korzystasz z innego frameworka, możesz dostosować tę funkcję do swojego środowiska.
* **Komponenty front‑endu** znajdują się w katalogu `src/components`. `ResolutionForm` generuje formularz na podstawie definicji pól w szablonie, a `ResolutionPreview` wyświetla podgląd wygenerowanej uchwały i udostępnia przycisk kopiowania do schowka. Te komponenty są napisane w React i mogą być użyte w aplikacji Next.js. Ponieważ to szkic, komponenty pokazują ogólną strukturę bez pełnego stylowania.

## Struktura katalogów

```
wm-uchwaly-generator/
├── README.md             – dokumentacja modułu i instrukcja integracji
├── package.json          – zależności i skrypty budowania (npm)
├── tsconfig.json         – konfiguracja TypeScript
├── templates/            – katalog z definicjami szablonów uchwał (JSON)
│   ├── plan_finansowy.json
│   ├── wybor_zarzadu.json
│   ├── zgoda_na_remont.json
│   ├── zmiana_regulaminu.json
│   └── absolutorium.json
├── src/
│   ├── types/
│   │   └── TemplateDefinition.ts  – interfejsy definiujące strukturę szablonu i pól
│   ├── utils/
│   │   ├── templateLoader.ts      – funkcja do ładowania szablonów z plików
│   │   ├── resolutionGenerator.ts – funkcja generująca treść uchwały
│   │   └── validation.ts          – walidacja pól formularza
│   ├── api/
│   │   └── generate.ts            – przykładowy endpoint API (Next.js)
│   └── components/
│       ├── ResolutionForm.tsx     – dynamiczny formularz React
│       ├── ResolutionPreview.tsx  – podgląd wygenerowanej uchwały
│       └── index.ts               – eksport publicznych komponentów
└── .gitignore
```

### Instrukcja integracji z istniejącym portalem

1. **Dodanie modułu do repozytorium** – skopiuj katalog `wm-uchwaly-generator` do folderu z modułami w Twoim projekcie. Upewnij się, że projekt korzysta z Node.js i TypeScript; dostosuj `package.json` do wersji używanych w Twoim portalu (skrypt `build` oraz zależności). Jeśli korzystasz z React bez Next.js, pomiń katalog `api`.

2. **Instalacja zależności** – w katalogu modułu uruchom `npm install` (lub `yarn`) w celu zainstalowania pakietów wymienionych w pliku `package.json`. Moduł używa m.in. `react`, `typescript` i biblioteki `uuid` do generowania identyfikatorów uchwał.

3. **Ładowanie szablonów** – pliki szablonów w katalogu `templates` są ładowane dynamicznie przez `templateLoader.ts`. Aby dodać nowy typ uchwały, utwórz nowy plik `.json` o unikalnym `id` i zdefiniuj w nim pola oraz tekst zgodnie z formatem opisanym niżej. Nie zapomnij zarejestrować nowego szablonu w UI (np. w komponencie wyboru typu uchwały).

4. **Korzystanie z API** – w aplikacji Next.js możesz dodać plik `pages/api/generate.ts` i zaimportować z `wm-uchwaly-generator/src/utils/resolutionGenerator`. Endpoint może przyjmować dane formularza i zwracać tekst uchwały. Jeśli portal ma własny backend, zaimplementuj analogiczną funkcję wykorzystując `generateResolution` z modułu.

5. **Użycie komponentów** – w warstwie front‑endu zaimportuj `ResolutionForm` i `ResolutionPreview` z modułu. Komponent formularza przyjmuje `template` (obiekt wczytany z `templates`) oraz funkcję, która odbiera wygenerowane dane. Komponent podglądu przyjmuje gotowy tekst uchwały i renderuje go w czytelnej formie oraz pozwala na skopiowanie treści.

6. **Walidacja i dostosowanie treści** – generator nie zastępuje konsultacji prawnych. Szablony przygotowane w module są przykładami i powinny zostać dostosowane do konkretnej wspólnoty oraz aktualnych przepisów. Pamiętaj o art. 23 ustawy, zgodnie z którym uchwały zapadają większością głosów liczoną według udziałów【729216983981508†L51-L63】, oraz o art. 25 ust. 1, który przewiduje możliwość zaskarżenia uchwały w razie naruszenia prawa lub interesów właściciela lokalu【9308900295†L51-L63】.

## Format plików szablonów

Każdy plik w katalogu `templates` definiuje jeden typ uchwały i ma następującą strukturę:

```json
{
  "id": "unikalny_id",
  "name": "Czytelna nazwa uchwały",
  "description": "Krótki opis celu uchwały",
  "fields": [
    {
      "name": "pole",
      "label": "Etykieta pola widoczna w formularzu",
      "type": "text" | "number" | "textarea" | "date",
      "required": true,
      "options": ["opcja1", "opcja2"]   // dla pól typu select
    },
    ...
  ],
  "template": "Tekst uchwały z wstawionymi znacznikami np. {{pole}}"
}
```

Znaczniki `{{nazwaPola}}` w polu `template` zostaną zastąpione wartościami podanymi przez użytkownika. Jeśli w formularzu wprowadzone są wielowierszowe dane (np. lista wydatków), generator zachowa oryginalne formatowanie w treści uchwały.

## Ograniczenia

* **Brak automatycznego głosowania** – moduł nie obsługuje procesu głosowania ani obliczania udziałów. Zakłada, że głosowanie odbywa się zgodnie z art. 23 ustawy o własności lokali【729216983981508†L51-L63】.
* **Przykładowe szablony** – dostarczone szablony są punktami wyjścia. Każda wspólnota powinna zweryfikować zgodność szablonów z własnymi regulaminami i ustawą.
* **Brak integracji z bazą danych** – moduł nie przechowuje wygenerowanych uchwał; integracja z systemem przechowywania dokumentów musi zostać zaimplementowana w portalu.

## Przykładowe użycie (Next.js)

```tsx
import { useState } from 'react';
import { loadTemplate } from 'wm-uchwaly-generator/src/utils/templateLoader';
import { generateResolution } from 'wm-uchwaly-generator/src/utils/resolutionGenerator';
import ResolutionForm from 'wm-uchwaly-generator/src/components/ResolutionForm';
import ResolutionPreview from 'wm-uchwaly-generator/src/components/ResolutionPreview';

export default function UchwalaPage() {
  const [text, setText] = useState('');
  const template = loadTemplate('plan_finansowy');
  return (
    <div>
      <h1>{template.name}</h1>
      <ResolutionForm
        template={template}
        onSubmit={(data) => {
          setText(generateResolution(template.id, data));
        }}
      />
      {text && <ResolutionPreview content={text} />}
    </div>
  );
}
```
