'use client';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import Camera from '@/components/camera';

const Meeting = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const keys = searchParams.get('keys'); 

  if (!keys || !id || typeof id !== 'string') {
    return <p>Invalid Meeting ID or Key</p>;
  }


    return (
      <div className='p-5'>
        <Camera roomId={id} password={keys} />
      </div>
    );

};

export default Meeting;
