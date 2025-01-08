import React from 'react'


const VideoEmbed = ({ value }: { value: { url: string } }) => {
  // Convertir l'URL en URL d'intégration YouTube
  const videoId = value.url.split('v=')[1]?.split('&')[0]; // Extraction de l'ID de la vidéo
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <iframe
      height="315"
      className='w-full'
      src={value.url}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
};

export default VideoEmbed