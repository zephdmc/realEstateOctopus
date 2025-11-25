import React from 'react';
import BlogCard from './BlogCard';

const RelatedPosts = ({ 
  posts, 
  currentPostId,
  title = "Related Articles",
  subtitle = "You might also be interested in these posts",
  className = "",
  maxPosts = 3
}) => {
  // Filter out the current post and limit to maxPosts
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, maxPosts);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 text-lg">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedPosts.map(post => (
          <BlogCard
            key={post.id}
            post={post}
          />
        ))}
      </div>

      {/* View All Posts CTA */}
      <div className="text-center mt-12">
        <a
          href="/blog"
          className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-lg"
        >
          <span>View All Blog Posts</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default RelatedPosts;