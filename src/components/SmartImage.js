'use client';
import Image from 'next/image';
import {useState} from 'react';
export default function SmartImage({src,alt='',fallback='/living-fallback.svg',...props}){
 const [failed,setFailed]=useState(false);
 return <Image {...props} src={failed?fallback:src} alt={alt} unoptimized onError={()=>setFailed(true)} />;
}
