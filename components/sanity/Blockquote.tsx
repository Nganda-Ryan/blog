import React from 'react'

const Blockquote = ({ value }: { value: { text: string; author: string } }) => (
    <blockquote style={{ fontStyle: 'italic', borderLeft: '4px solid #ddd', paddingLeft: '0.5rem' }}>
      <p>{value.text}</p>
      {value.author && <footer>— {value.author}</footer>}
    </blockquote>
);
  

export default Blockquote