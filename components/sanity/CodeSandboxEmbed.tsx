import React from 'react'

const CodeSandboxEmbed = ({ value }: { value: { embedUrl: string } }) => (
    <iframe
      src={value.embedUrl}
      title="Youtube embed"
      style={{ width: '100%', height: '500px', border: 'none' }}
      loading="lazy"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    ></iframe>
);
  

export default CodeSandboxEmbed