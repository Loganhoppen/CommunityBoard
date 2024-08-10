import dbConnect from '../../dbConnect';
import User from '../../models/User';
import { hash } from 'bcryptjs';

// API route for handling user registration
export async function POST(req) {
  await dbConnect(); // Connect to the database

  const { email, password } = await req.json(); // Extract email and password from request body

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ success: false, message: 'User already exists' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Hash the password before saving it to the database
  const hashedPassword = await hash(password, 12);

  // Create a new user and save it to the database
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  // Respond with success status
  return new Response(JSON.stringify({ success: true }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
