import dbConnect from '../dbConnect';
import Post from '../models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function DELETE(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const session = await getServerSession(req, authOptions);

  if (!session) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return new Response(JSON.stringify({ success: false, message: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (post.author.toString() !== session.user.id) {
      return new Response(JSON.stringify({ success: false, message: 'Not authorized to delete this post' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await Post.findByIdAndDelete(id);

    return new Response(JSON.stringify({ success: true, message: 'Post deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Error deleting post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
