import React from 'react';
import { Link } from 'react-router-dom';

const BlogPost = ({ 
  post, 
  className = "" 
}) => {
  // Map your Blog model structure to the expected props
  const {
    _id, // MongoDB uses _id
    id = _id, // Fallback to _id if id doesn't exist
    title,
    content,
    excerpt,
    featuredImage,
    authorName, // From your Blog model
    authorEmail, // From your Blog model
    authorAvatar, // From your Blog model
    author = { // Create author object from Blog model fields
      name: authorName,
      email: authorEmail,
      avatar: authorAvatar,
      role: 'Author'
    },
    createdAt, // From your Blog model
    updatedAt, // From your Blog model
    publishDate = createdAt, // Fallback to createdAt
    updatedDate = updatedAt, // Fallback to updatedAt
    readTime,
    categories,
    tags,
    featured = false,
    views = 0,
    likes = [],
    comments = [],
    slug,
    relatedPosts = []
  } = post;

  // Get image URL - handle both string and object formats
  const getImageUrl = () => {
    if (!featuredImage) return '/images/blog-placeholder.jpg';
    
    // If featuredImage is an object (from your Blog model)
    if (typeof featuredImage === 'object' && featuredImage.url) {
      return featuredImage.url;
    }
    
    // If featuredImage is a string
    if (typeof featuredImage === 'string') {
      return featuredImage;
    }
    
    return '/images/blog-placeholder.jpg';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'market-news': 'bg-blue-100 text-blue-800 border border-blue-200',
      'home-improvement': 'bg-green-100 text-green-800 border border-green-200',
      'investment': 'bg-purple-100 text-purple-800 border border-purple-200',
      'neighborhood': 'bg-orange-100 text-orange-800 border border-orange-200',
      'design-tips': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      'mortgage': 'bg-pink-100 text-pink-800 border border-pink-200',
      'legal': 'bg-red-100 text-red-800 border border-red-200',
      'lifestyle': 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const formatCategoryName = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const TableOfContents = ({ content }) => {
    // Simple TOC extraction - in real app, you might want to parse headings from content
    const headings = [
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'key-points', title: 'Key Points', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 }
    ];

    return (
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
                  style={{ marginLeft: `${(heading.level - 2) * 1}rem` }}
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{heading.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  };

  // Check if content is HTML or plain text
  const isHTMLContent = (content) => {
    if (!content) return false;
    return /<[a-z][\s\S]*>/i.test(content);
  };

  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <header className="mb-8">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <Link
                key={category}
                to={`/blog/category/${category}`}
                className={`px-3 py-1 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity duration-200 ${getCategoryColor(category)}`}
              >
                {formatCategoryName(category)}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {title || 'Untitled Post'}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Author */}
            <div className="flex items-center space-x-3">
              <img
                src={author?.avatar || authorAvatar || '/images/avatar-placeholder.jpg'}
                alt={author?.name || authorName || 'Author'}
                className="w-12 h-12 rounded-full"
                onError={(e) => {
                  e.target.src = '/images/avatar-placeholder.jpg';
                }}
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {author?.name || authorName || 'Unknown Author'}
                </p>
                <p className="text-sm text-gray-600">
                  {author?.role || 'Author'}
                </p>
              </div>
            </div>

            {/* Published Date */}
            <div className="text-sm text-gray-600">
              <p>Published {formatDate(publishDate)}</p>
              {updatedDate && publishDate !== updatedDate && (
                <p>Updated {formatDate(updatedDate)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{readTime || 5} min read</span>
            {featured && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
          <span>👁️ {views || 0} views</span>
          <span>💬 {comments?.length || 0} comments</span>
          <span>❤️ {likes?.length || 0} likes</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8 rounded-2xl overflow-hidden">
        <img
          src={getImageUrl()}
          alt={featuredImage?.alt || title || 'Blog post'}
          className="w-full h-auto max-h-96 object-cover"
          onError={(e) => {
            e.target.src = '/images/blog-placeholder.jpg';
          }}
        />
        {featuredImage?.alt && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            {featuredImage.alt}
          </p>
        )}
      </div>

      {/* Excerpt */}
      {excerpt && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <p className="text-lg font-medium text-blue-900 italic">
            "{excerpt}"
          </p>
        </div>
      )}

      {/* Table of Contents */}
      <TableOfContents content={content} />

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        {isHTMLContent(content) ? (
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="space-y-6 text-gray-700 leading-relaxed">
            {content ? (
              // Render plain text content with basic formatting
              content.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index}>{paragraph}</p>
                ) : (
                  <br key={index} />
                )
              ))
            ) : (
              // Fallback content if no content
              <div className="space-y-6">
                <p>
                  This is a sample blog post content. In a real application, this would be populated
                  with the actual blog content from your CMS or database.
                </p>
                
                <h2 id="introduction">Introduction</h2>
                <p>
                  The real estate market continues to evolve, with new trends and opportunities emerging
                  regularly. Understanding these changes is crucial for both buyers and sellers.
                </p>

                <h2 id="key-points">Key Points</h2>
                <p>
                  Market analysis shows steady growth in suburban areas while urban centers experience
                  shifting demand patterns. Technology continues to transform how properties are bought
                  and sold.
                </p>

                <h2 id="conclusion">Conclusion</h2>
                <p>
                  Staying informed about market trends and working with experienced professionals can
                  help you make the most of your real estate investments.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link
                key={tag}
                to={`/blog/tag/${tag}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <img
            src={author?.avatar || authorAvatar || '/images/avatar-placeholder.jpg'}
            alt={author?.name || authorName || 'Author'}
            className="w-16 h-16 rounded-full flex-shrink-0"
            onError={(e) => {
              e.target.src = '/images/avatar-placeholder.jpg';
            }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              About {author?.name || authorName || 'the Author'}
            </h3>
            <p className="text-gray-600 mb-3">
              {author?.bio || `${author?.name || authorName || 'This author'} is an experienced real estate professional with deep knowledge of market trends and property investment strategies.`}
            </p>
            <div className="flex space-x-4">
              {author?.email && (
                <a href={`mailto:${author.email}`} className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <span className="sr-only">Email</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </a>
              )}
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
        <div className="flex space-x-4">
          {[
            { name: 'twitter', color: 'hover:bg-blue-400 hover:text-white' },
            { name: 'facebook', color: 'hover:bg-blue-600 hover:text-white' },
            { name: 'linkedin', color: 'hover:bg-blue-700 hover:text-white' },
            { name: 'email', color: 'hover:bg-gray-600 hover:text-white' }
          ].map(platform => (
            <button
              key={platform.name}
              className={`p-3 bg-gray-100 rounded-lg transition-all duration-200 text-gray-600 ${platform.color}`}
              title={`Share on ${platform.name}`}
            >
              <span className="sr-only">Share on {platform.name}</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                {/* Simple share icon as placeholder */}
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Comments ({comments?.length || 0})
        </h3>
        
        {comments && comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.userAvatar || '/images/avatar-placeholder.jpg'}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      e.target.src = '/images/avatar-placeholder.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.userName}</h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </article>
  );
};

export default BlogPost;