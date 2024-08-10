import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '../../dbConnect';
import User from '../../models/User';
import { compare } from 'bcryptjs';

// Configuration options for NextAuth
export const authOptions = {
  providers: [
    // Credentials provider for email and password login
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        await dbConnect(); // Connect to the database
        const { email, password } = credentials;

        // Validate that email and password are provided
        if (!email || !password) {
          throw new Error('Email and password are required.');
        }

        // Find user in the database
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Compare provided password with the stored hashed password
        const isValid = await compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        // Return user object if authentication is successful
        return { email: user.email };
      },
    }),
    // Google provider for OAuth-based login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/',  // Custom sign-in page
  },
};

// Export GET and POST methods for NextAuth API routes
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
