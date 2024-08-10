'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Login page component for user authentication
export default function LoginPage() {
  const router = useRouter(); // Router for navigation
  const [email, setEmail] = useState(''); // State for the user's email
  const [password, setPassword] = useState(''); // State for the user's password
  const [error, setError] = useState(null); // State for error messages

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    const result = await signIn('google', {
      callbackUrl: '/home', // Redirect to the homepage on successful login
    });

    if (!result.error) {
      router.push('/home');
    } else {
      alert('Login failed: ' + result.error); // Display an error message if login fails
    }
  };

  // Function to handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email: email,  
      password: password,  
    });

    if (result.error) {
      setError(result.error); // Display an error message if login fails
    } else {
      router.push('/home'); // Redirect to the homepage on successful login
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

        <form onSubmit={handleEmailLogin} className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-3 border w-full rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-3 border w/full rounded-md"
            />
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="flex justify-center mb-4">
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-600 text-white py-3 rounded-md w-full"
          >
            Login with Google
          </button>
        </div>

        <div className="text-center">
          <p>
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-600">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
