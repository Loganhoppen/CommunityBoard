'use client';

import { signOut } from 'next-auth/react';

export default function Navbar() {
  return (
    <div className='p-4 flex justify-between items-center shadow-md'>
      <h1 className='font-bold text-lg text-blue-700'>A Community Board</h1>
      <button
        className=''
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        
      </button>
    </div>
  );
}
