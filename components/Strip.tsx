import React from 'react';

export enum StripBgColor {
  Blue = 'after:bg-blue-500',
  Green = 'after:bg-green-600',
  Indigo = 'after:bg-indigo-500',
  Pink = 'after:bg-pink-500',
  Gray = 'after:bg-gray-600',
  Red = 'after:bg-red-400',
}

interface StripType {
    children?: React.ReactNode;
    color?: StripBgColor;
}
const Strip = ({children, color}: StripType) => {
  return (
    <span className={`relative z-10 after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-0 after:h-1/3 after:transition-all after:duration-300 ${color ? color : 'after:bg-pur'} hover:after:w-full after:z-[-1]`}>
        {children}
    </span>
  )
}

export default Strip