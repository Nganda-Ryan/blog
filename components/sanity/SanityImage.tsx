/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import React from 'react'
import { urlFor } from './../../sanity/sanity-utils';

const SanityImage = ({ value }: { value: any }) => {
    const imageAlt = (urlFor(value).options.source as { alt: string }).alt;
    return (
        <div className="w-full flex justify-center items-center">
            <Image 
                src={urlFor(value).url()} 
                alt={imageAlt} 
                width={500}
                height={500}
                className='w-full max-w-xl mx-auto'
            />
        </div>
    );
}

export default SanityImage