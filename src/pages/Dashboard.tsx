import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const AddArticle = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('home-decor');
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        let imageUrl = '';
        if (image) {
          const storageRef = ref(storage, `articles/${image.name}`);
          await uploadBytes(storageRef, image);
          imageUrl = await getDownloadURL(storageRef);
        }

        await addDoc(collection(db, 'articles'), {
          title,
          content,
          category,
          imageUrl,
          createdAt: new Date().toISOString(),
        });

        setTitle('');
        setContent('');
        setCategory('home-decor');
        setImage(null);
        alert('Article added successfully!');
      } catch (error) {
        console.error('Error adding article:', error);
        alert('Error adding article. Please try again.');
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Add New Article</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="home-decor">Home Decor</option>
              <option value="travel-deals">Travel Deals</option>
              <option value="home-appliances">Home Appliances</option>
              <option value="garden-planting">Garden Planting</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Article
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/add"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Add Article
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold text-center">Welcome to Dashboard</h1>} />
          <Route path="/add" element={<AddArticle />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;