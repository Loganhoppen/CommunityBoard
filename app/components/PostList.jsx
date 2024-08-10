'use client';

import { useState } from 'react';

// Component to display and manage a list of posts
const PostList = ({ posts, setPosts }) => {
  const [error, setError] = useState(null); // State for error messages
  const [activePost, setActivePost] = useState(null); // State to track which post is being commented on
  const [comment, setComment] = useState(''); // State for the new comment text

  // Function to handle adding a comment to a post
  const handleAddComment = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: comment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the comments for the post in the post list
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, comments: data.data } : post
          )
        );
        setComment(''); // Clear the comment input
        setActivePost(null); // Reset the active post state
      } else {
        alert('Failed to add comment');
      }
    } catch (error) {
      console.error('An error occurred while adding comment:', error);
      setError('Failed to add comment. Please try again later.');
    }
  };

  // Function to handle deleting a post
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setPosts(posts.filter((post) => post._id !== id)); // Remove the deleted post from the list
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('An error occurred while deleting post:', error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Posts</h2>
      {posts.map((post) => (
        <div key={post._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-4">{post.content}</p>

          <div className="mt-4">
            <h4 className="font-bold">Comments:</h4>
            {post.comments && post.comments.map((comment, index) => (
              <div key={index} className="ml-4 mt-2">
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>

          {activePost === post._id ? (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="p-2 border rounded-md w-full mb-2"
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAddComment(post._id)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setActivePost(null);
                    setComment('');
                  }}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActivePost(post._id)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md mt-2"
            >
              Comment
            </button>
          )}

          <div className="flex justify-end items-center mt-4">
            <button 
              onClick={() => handleDelete(post._id)} 
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
