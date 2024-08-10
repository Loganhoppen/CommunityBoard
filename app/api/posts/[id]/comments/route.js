import dbConnect from '../../../dbConnect';
import Post from '../../../models/Post';

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const { text } = await req.json();
    const { id } = params; 

    const post = await Post.findById(id);

    if (!post) {
      return new Response(JSON.stringify({ success: false, message: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    
    if (!post.comments) {
      post.comments = [];
    }

    
    post.comments.push({ text });

    await post.save();

    return new Response(JSON.stringify({ success: true, data: post.comments }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to add comment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
