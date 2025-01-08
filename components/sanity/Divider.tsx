import React from 'react'

const Divider = ({ value }: { value: { style: string } }) => (
    <hr
      style={{
        borderStyle: value.style || 'solid',
        margin: '20px 0',
      }}
    />
);

export default Divider