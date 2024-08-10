'use client';

import { useState } from 'react';

// Component for creating a new post
const CreatePostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState(''); // State for the post title
  const [content, setContent] = useState(''); // State for the post content

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the server to create a new post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setTitle(''); // Clear the title input
        setContent(''); // Clear the content input
        onPostCreated(data.data); // Callback to update the post list
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Post</h2>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-4 border rounded-md"
        required
      />
      <textarea
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 mb-4 border rounded-md"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md">
        Create Post
      </button>
    </form>
  );
};

export default CreatePostForm;
