export type FieldType = 'text' | 'number' | 'textarea' | 'date' | 'select';

/**
 * Opis pojedynczego pola formularza. Każde pole posiada nazwę, etykietę,
 * typ oraz informację, czy jest wymagane. W przypadku pól typu select
 * można zdefiniować listę dostępnych opcji.
 */
export interface TemplateField {
  /**
   * Identyfikator pola używany w znacznikach (np. {{name}})
   */
  name: string;
  /**
   * Etykieta wyświetlana w interfejsie użytkownika
   */
  label: string;
  /**
   * Typ pola; determinuje sposób renderowania w formularzu
   */
  type: FieldType;
  /**
   * Czy pole jest wymagane w celu wygenerowania uchwały
   */
  required?: boolean;
  /**
   * Dodatkowe opcje dla pól typu select
   */
  options?: string[];
}

/**
 * Definicja szablonu uchwały. Każdy szablon posiada unikalne id, nazwę,
 * opis, listę pól formularza oraz tekst uchwały z wstawkami (placeholderami).
 */
export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  template: string;
}