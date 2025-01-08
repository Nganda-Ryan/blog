import React from 'react'

const Timeline = ({ value }: { value: { events: { date: string; description: string }[] } }) => (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {value.events.map((event, index) => (
        <li key={index} style={{ marginBottom: '1rem' }}>
          <strong>{event.date}</strong>
          <p>{event.description}</p>
        </li>
      ))}
    </ul>
);
  

export default Timeline