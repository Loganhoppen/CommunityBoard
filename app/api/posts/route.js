import dbConnect from '../dbConnect';
import Post from '../models/Post';

export async function GET(req) {
  await dbConnect();

  try {
    const posts = await Post.find({});
    return new Response(JSON.stringify({ success: true, data: posts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to load posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { title, content } = await req.json();

    const post = new Post({
      title,
      content,
    });

    await post.save();

    return new Response(JSON.stringify({ success: true, data: post }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to create post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return new Response(JSON.stringify({ success: false, message: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
