import React from 'react'

const CallToAction = ({ value }: { value: { text: string; url: string } }) => (
    <a
      href={value.url}
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px',
      }}
    >
      {value.text}
    </a>
);
  

export default CallToAction