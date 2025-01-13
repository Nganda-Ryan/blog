import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Composant pour afficher du code avec un style avancé
export const AdvancedCodeBlock = ({
  value,
}: {
  value: { code: string; language: string };
}) => {
  const { code, language } = value;

  return (
    <div style={{ margin: '1rem 0', borderRadius: '8px', overflow: 'hidden' }}>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        showLineNumbers={true} // Montre les numéros de ligne
        wrapLines={true}      // Permet de gérer les longues lignes
        customStyle={{
          padding: '1rem',
          fontSize: '0.85rem',
          lineHeight: '1.5',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
