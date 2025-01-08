import Image from 'next/image';
import React from 'react'
import { urlFor } from './../../sanity/sanity-utils';

const SanityImage = ({ value }: { value: any }) => {
    const imageAlt = (urlFor(value).options.source as { alt: string }).alt;
    return (
        <Image 
        src={urlFor(value).url()} 
        alt={imageAlt} 
        width={500}
        height={500}
        className='w-full'
        />
    );
}

export default SanityImage