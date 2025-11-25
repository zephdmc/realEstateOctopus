import React, { useState, useEffect } from 'react';
import { Search, Upload, Image, File, Video, Trash2, Download, Eye, Filter } from 'lucide-react';

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'document', label: 'Documents' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockMedia = [
        {
          id: 1,
          name: 'property-exterior.jpg',
          url: '/media/property1.jpg',
          type: 'image',
          size: '2.4 MB',
          dimensions: '1920x1080',
          uploaded: '2024-01-15',
          usedIn: ['Modern Villa Listing']
        },
        {
          id: 2,
          name: 'living-room-interior.png',
          url: '/media/living-room.jpg',
          type: 'image',
          size: '3.1 MB',
          dimensions: '1920x1080',
          uploaded: '2024-01-14',
          usedIn: ['Modern Villa Listing', 'Featured Properties']
        },
        {
          id: 3,
          name: 'property-video-tour.mp4',
          url: '/media/tour-video.mp4',
          type: 'video',
          size: '45.2 MB',
          dimensions: '1920x1080',
          uploaded: '2024-01-13',
          usedIn: ['Modern Villa Listing']
        },
        {
          id: 4,
          name: 'floor-plan.pdf',
          url: '/media/floor-plan.pdf',
          type: 'document',
          size: '1.2 MB',
          dimensions: '-',
          uploaded: '2024-01-12',
          usedIn: ['Modern Villa Listing']
        },
        {
          id: 5,
          name: 'kitchen-design.jpg',
          url: '/media/kitchen.jpg',
          type: 'image',
          size: '2.8 MB',
          dimensions: '1920x1080',
          uploaded: '2024-01-11',
          usedIn: []
        }
      ];
      setMedia(mockMedia);
      setFilteredMedia(mockMedia);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterMedia();
  }, [searchTerm, typeFilter, media]);

  const filterMedia = () => {
    let filtered = media;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    setFilteredMedia(filtered);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setUploading(true);
      // Simulate upload process
      setTimeout(() => {
        const newFiles = Array.from(files).map((file, index) => ({
          id: media.length + index + 1,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type.split('/')[0],
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          dimensions: 'Unknown',
          uploaded: new Date().toISOString().split('T')[0],
          usedIn: []
        }));
        setMedia(prev => [...prev, ...newFiles]);
        setUploading(false);
      }, 2000);
    }
  };

  const handleDelete = (mediaItem) => {
    setMedia(media.filter(item => item.id !== mediaItem.id));
  };

  const handlePreview = (mediaItem) => {
    setPreviewMedia(mediaItem);
    setShowPreview(true);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="text-blue-500" size={24} />;
      case 'video':
        return <Video className="text-purple-500" size={24} />;
      case 'document':
        return <File className="text-green-500" size={24} />;
      default:
        return <File className="text-gray-500" size={24} />;
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'document':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage your images, videos, and documents</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 cursor-pointer"
            >
              <Upload size={20} />
              <span>Upload Files</span>
            </label>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Uploading files...</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search media..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="size">Size</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-gray-100 relative group">
              {item.type === 'image' ? (
                <img
                  src={item.url || '/placeholder-media.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  {getFileIcon(item.type)}
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    className="bg-white p-2 rounded-full hover:bg-gray-100"
                    onClick={() => handlePreview(item)}
                  >
                    <Eye size={16} />
                  </button>
                  <button className="bg-white p-2 rounded-full hover:bg-gray-100">
                    <Download size={16} />
                  </button>
                  <button
                    className="bg-white p-2 rounded-full hover:bg-gray-100"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* File Info */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeColor(item.type)}`}>
                  {item.type}
                </span>
                <span className="text-xs text-gray-500">{item.size}</span>
              </div>
              
              <h3 className="font-medium text-sm mb-1 truncate" title={item.name}>
                {item.name}
              </h3>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div>{item.dimensions}</div>
                <div>Uploaded: {new Date(item.uploaded).toLocaleDateString()}</div>
                {item.usedIn.length > 0 && (
                  <div className="truncate" title={item.usedIn.join(', ')}>
                    Used in: {item.usedIn.length} place(s)
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900">No media files found</h3>
          <p className="text-gray-500 mt-1">Upload some files to get started</p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">{previewMedia.name}</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowPreview(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-8 flex items-center justify-center max-h-[70vh] overflow-auto">
              {previewMedia.type === 'image' ? (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : previewMedia.type === 'video' ? (
                <video controls className="max-w-full max-h-full">
                  <source src={previewMedia.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center">
                  <File size={64} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Preview not available for {previewMedia.type} files</p>
                  <a
                    href={previewMedia.url}
                    download
                    className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {previewMedia.type}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {previewMedia.size}
                </div>
                <div>
                  <span className="font-medium">Dimensions:</span> {previewMedia.dimensions}
                </div>
                <div>
                  <span className="font-medium">Uploaded:</span> {new Date(previewMedia.uploaded).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;