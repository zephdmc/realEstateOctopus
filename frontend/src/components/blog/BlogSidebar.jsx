import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import NewsletterForm from '../forms/NewsletterForm';

const BlogSidebar = ({ 
  recentPosts = [],
  categories = [],
  tags = [],
  popularPosts = [],
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blog/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const popularCategories = categories.slice(0, 5);
  const popularTags = tags.slice(0, 10);

  return (
    <aside className={`space-y-8 ${className}`}>
      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Blog</h3>
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* About Section */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About Our Blog</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Welcome to our real estate blog! We share expert insights, market trends, buying and selling tips, 
          and industry news to help you make informed decisions in your real estate journey.
        </p>
        <Link
          to="/about"
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1"
        >
          <span>Learn more about us</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <ul className="space-y-2">
            {popularCategories.map(category => (
              <li key={category.slug}>
                <Link
                  to={`/blog/category/${category.slug}`}
                  className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors duration-200 py-2 group"
                >
                  <span className="capitalize">{category.name}</span>
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-200">
                    {category.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {categories.length > 5 && (
            <Link
              to="/blog/categories"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-3 inline-block"
            >
              View all categories
            </Link>
          )}
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {recentPosts.slice(0, 3).map(post => (
              <BlogCard
                key={post.id}
                post={post}
                variant="minimal"
              />
            ))}
          </div>
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-4 inline-block"
          >
            View all posts
          </Link>
        </div>
      )}

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Posts</h3>
          <div className="space-y-4">
            {popularPosts.slice(0, 3).map((post, index) => (
              <div key={post.id} className="flex items-start space-x-3 group">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-semibold mt-1">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/blog/${post.id}`}
                    className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {new Date(post.publishDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Link
                key={tag.slug}
                to={`/blog/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
        <p className="text-gray-600 text-sm mb-4">
          Get the latest real estate insights and market updates delivered to your inbox.
        </p>
        <NewsletterForm
          variant="minimal"
          size="small"
        />
      </div>

      {/* Follow Us */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          {[
            { name: 'facebook', color: 'hover:text-blue-600', icon: '📘' },
            { name: 'twitter', color: 'hover:text-blue-400', icon: '🐦' },
            { name: 'instagram', color: 'hover:text-pink-600', icon: '📷' },
            { name: 'linkedin', color: 'hover:text-blue-700', icon: '💼' }
          ].map(social => (
            <a
              key={social.name}
              href="#"
              className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 ${social.color} transition-colors duration-200`}
              aria-label={`Follow us on ${social.name}`}
            >
              <span className="text-lg">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-3">Need Real Estate Help?</h3>
        <p className="text-blue-100 text-sm mb-4">
          Our expert agents are ready to assist you with buying, selling, or investing in properties.
        </p>
        <Link
          to="/contact"
          className="block w-full bg-white text-blue-600 text-center py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
        >
          Contact an Agent
        </Link>
      </div>
    </aside>
  );
};

export default BlogSidebar;