import React, { useState } from 'react';
import type { TemplateDefinition, TemplateField } from '../types/TemplateDefinition';
import { validateData } from '../utils/validation';

export interface ResolutionFormProps {
  template: TemplateDefinition;
  /**
   * Funkcja wywoływana po kliknięciu przycisku generowania. Otrzymuje
   * obiekt z danymi z formularza, jeśli walidacja się powiedzie.
   */
  onSubmit: (data: Record<string, any>) => void;
}

/**
 * Komponent wyświetlający dynamiczny formularz na podstawie definicji
 * szablonu. Użytkownik wprowadza wartości do pól, a po naciśnięciu
 * przycisku "Generuj" dane są walidowane i przekazywane do funkcji onSubmit.
 */
const ResolutionForm: React.FC<ResolutionFormProps> = ({ template, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    template.fields.forEach((field) => {
      initial[field.name] = '';
    });
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: TemplateField, value: any) => {
    setFormData((prev) => ({ ...prev, [field.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(template, formData);
    setErrors(validation.errors);
    if (validation.valid) {
      onSubmit(formData);
    }
  };

  const renderField = (field: TemplateField) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleChange(field, e.target.value)
    };
    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} />;
      case 'number':
        return <input type="number" {...commonProps} />;
      case 'date':
        return <input type="date" {...commonProps} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">-- wybierz --</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'text':
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
      {template.fields.map((field) => (
        <div key={field.name} style={{ marginBottom: '1rem' }}>
          <label htmlFor={field.name} style={{ display: 'block', fontWeight: 'bold' }}>
            {field.label}{field.required && ' *'}
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors[field.name]}</div>
          )}
        </div>
      ))}
      <button type="submit">Generuj uchwałę</button>
    </form>
  );
};

export default ResolutionForm;