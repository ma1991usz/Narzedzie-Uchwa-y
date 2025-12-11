import React from 'react';

export interface ResolutionPreviewProps {
  content: string;
}

/**
 * Komponent wyświetlający podgląd wygenerowanej uchwały.
 * Umożliwia skopiowanie treści do schowka za pomocą przycisku.
 */
const ResolutionPreview: React.FC<ResolutionPreviewProps> = ({ content }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Treść uchwały została skopiowana do schowka.');
    } catch (err) {
      alert('Nie udało się skopiować tekstu.');
    }
  };
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Podgląd uchwały</h2>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '1rem', border: '1px solid #ccc' }}>
        {content}
      </pre>
      <button onClick={handleCopy}>Kopiuj treść</button>
    </div>
  );
};

export default ResolutionPreview;