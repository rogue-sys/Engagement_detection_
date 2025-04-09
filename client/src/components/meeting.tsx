'use client';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import CryptoJS from 'crypto-js';
import Camera from './camera';

const Meeting = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const keys = searchParams.get('keys'); 

  if (!keys || !id || typeof id !== 'string') {
    return <p>Invalid Meeting ID or Key</p>;
  }

  try {
    const decodedId = decodeURIComponent(id);
    const decodedKeys = decodeURIComponent(keys);

    const decryptedRoomId = CryptoJS.AES.decrypt(decodedId, process.env.NEXT_PUBLIC_SECRET_KEY!).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(decodedKeys, process.env.NEXT_PUBLIC_SECRET_KEY!).toString(CryptoJS.enc.Utf8);

    if (!decryptedRoomId || !decryptedPassword) {
      return <p>Invalid Meeting Data</p>;
    }

    return (
      <div>
        <Camera roomId={decryptedRoomId} password={decryptedPassword} />
      </div>
    );
  } catch (error) {
    console.error('Decryption error:', error);
    return <p>Invalid Meeting Data</p>;
  }
};

export default Meeting;
