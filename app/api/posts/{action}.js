

import dbConnect from '../dbConnect';
import Post from '../models/Post';

export async function PUT(req, { params }) {
  await dbConnect();

  const { action } = params;
  const { id } = await req.json(); 

  if (action === 'like') {
    try {
      const post = await Post.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } }, // Increment the likes field by 1
        { new: true }
      );

      if (!post) {
        return new Response(JSON.stringify({ success: false, message: 'Post not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data: post }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response(JSON.stringify({ success: false, message: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
