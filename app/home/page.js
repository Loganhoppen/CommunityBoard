'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreatePostForm from '../components/CreatePostForm';
import PostList from '../components/PostList';

// HomePage component for authenticated users
export default function HomePage() {
  const { status, data: session } = useSession(); // Get the current session
  const router = useRouter(); // Router for navigation
  const [showScrollToTop, setShowScrollToTop] = useState(false); // State for "scroll to top" button visibility
  const [posts, setPosts] = useState([]); // State for the list of posts

  // Function to fetch posts from the server
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setPosts(data.data); // Set the posts state with the fetched data
      } else {
        throw new Error('Failed to load posts');
      }
    } catch (error) {
      console.error('An error occurred while fetching posts:', error);
    }
  };

  // Callback function to handle new post creation
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]); // Add the new post to the top of the post list
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to login page if unauthenticated
    }
    fetchPosts(); // Fetch posts on component mount

    // Add scroll event listener to manage the "scroll to top" button
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [status, router]);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (status === 'loading') {
    return <p>Loading...</p>; // Show loading text while the session is loading
  }

  if (status === 'authenticated') {
    return (
      <div className="flex">
        <div className="flex-1 p-6">
          {showScrollToTop && (
            <div
              onClick={scrollToTop}
              className="fixed top-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-full cursor-pointer shadow-lg"
            >
              Scroll to Top
            </div>
          )}
          <div className="mb-8">
            <CreatePostForm onPostCreated={handlePostCreated} />
          </div>
          <PostList posts={posts} setPosts={setPosts} />
        </div>
        <div className="w-1/4 p-4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col items-center text-center">
              <img
                src={session.user.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-lg font-bold">{session.user.name}</h2>
              <p className="text-sm text-gray-600">{session.user.email}</p>
            </div>
            <button
              className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
