import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function BlogOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setBlog(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0ab39c',
      cancelButtonColor: '#f06548',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, { method: 'DELETE' });
          if (res.ok) {
            Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
            navigate('/blogs/list');
          } else {
            Swal.fire('Failed!', 'Could not delete blog.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'Server error.', 'error');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#405189]"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Blog Not Found</h2>
        <p className="mb-4">The blog you are looking for does not exist.</p>
        <Link to="/blogs/list" className="text-blue-500 hover:underline">Back to List View</Link>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans bg-[#f3f6f9] min-h-screen">

      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/blogs/list')}
            className="p-2 rounded-[0.25rem] bg-white border border-[#e9ebec] text-gray-500 hover:text-[#405189] hover:border-[#405189] transition-colors"
            title="Back to List"
          >
            <ArrowLeft size={16} />
          </button>
          <h4 className="text-[15px] font-medium text-gray-700 uppercase tracking-wide">Blog Overview</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/blogs/add', { state: { blogData: blog } })}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#299cdb] rounded hover:bg-[#258bbf] transition-colors"
          >
            <Edit2 size={14} />
            Edit Blog
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#f06548] rounded hover:bg-[#d6573e] transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Blog Card Header */}
        <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)] mb-6 overflow-hidden">
          
          {/* Featured Image */}
          <div className="w-full h-[380px] overflow-hidden">
            <img 
              src={blog.image || 'https://placehold.co/1000x500/e0e0e0/555?text=No+Image'} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Header Info */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold text-[#0ab39c] uppercase tracking-wider bg-[#0ab39c]/10 px-2.5 py-1 rounded-sm">
                {blog.category}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-sm ${blog.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {blog.status === 'Active' ? 'Published' : 'Draft'}
              </span>
            </div>
            <h1 className="text-[24px] font-bold text-[#495057] mb-3">{blog.title}</h1>
            <div className="flex items-center gap-4 text-[12px] text-gray-500 border-t border-[#f3f6f9] pt-4">
              <span>By <strong className="text-gray-700">{blog.author}</strong></span>
              <span>Published: {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : new Date(blog.createdAt).toLocaleDateString()}</span>
              <span>Last Edited: {new Date(blog.updatedAt).toLocaleDateString()}</span>
              <span>{blog.views || 0} Views</span>
            </div>
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-medium text-[#0ab39c] bg-[#0ab39c]/10 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)] p-6 mb-6">
          <h5 className="text-[14px] font-semibold text-[#495057] mb-4 pb-3 border-b border-[#f3f6f9]">Content</h5>
          <div 
            className="blog-overview-content"
            style={{
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#495057'
            }}
            dangerouslySetInnerHTML={{ __html: blog.desc }}
          />
        </div>

        {/* Attached Files */}
        {blog.attachedFiles && blog.attachedFiles.length > 0 && (
          <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)] p-6 mb-6">
            <h5 className="text-[14px] font-semibold text-[#495057] mb-4 pb-3 border-b border-[#f3f6f9]">Attached Files</h5>
            <ul className="space-y-2">
              {blog.attachedFiles.map((fileUrl, idx) => (
                <li key={idx} className="flex items-center gap-3 p-2 bg-[#f3f6f9] rounded border border-[#e9ebec]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ab39c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  <a href={fileUrl} target="_blank" rel="noreferrer" className="text-[13px] text-[#405189] hover:underline truncate">
                    {fileUrl.split('/').pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SEO Info */}
        {(blog.metaTitle || blog.metaDesc) && (
          <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)] p-6">
            <h5 className="text-[14px] font-semibold text-[#495057] mb-4 pb-3 border-b border-[#f3f6f9]">SEO Details</h5>
            {blog.metaTitle && (
              <div className="mb-3">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Meta Title</label>
                <p className="text-[13px] text-gray-700 mt-1">{blog.metaTitle}</p>
              </div>
            )}
            {blog.metaDesc && (
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Meta Description</label>
                <p className="text-[13px] text-gray-700 mt-1">{blog.metaDesc}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inline styles for Quill rendered HTML content */}
      <style>{`
        .blog-overview-content {
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
          max-width: 100%;
          overflow: hidden;
        }
        .blog-overview-content h1 { font-size: 2em; font-weight: bold; margin: 0.8em 0 0.4em; color: #212529; }
        .blog-overview-content h2 { font-size: 1.5em; font-weight: bold; margin: 0.8em 0 0.4em; color: #212529; }
        .blog-overview-content h3 { font-size: 1.3em; font-weight: bold; margin: 0.8em 0 0.4em; color: #212529; }
        .blog-overview-content h4, .blog-overview-content h5, .blog-overview-content h6 { font-weight: bold; margin: 0.6em 0 0.3em; color: #212529; }
        .blog-overview-content p { margin-bottom: 1em; max-width: 100%; }
        .blog-overview-content ul { list-style: disc; padding-left: 2em; margin-bottom: 1em; }
        .blog-overview-content ol { list-style: decimal; padding-left: 2em; margin-bottom: 1em; }
        .blog-overview-content li { margin-bottom: 0.4em; }
        .blog-overview-content strong { font-weight: bold; }
        .blog-overview-content em { font-style: italic; }
        .blog-overview-content u { text-decoration: underline; }
        .blog-overview-content s { text-decoration: line-through; }
        .blog-overview-content blockquote { border-left: 4px solid #0ab39c; padding-left: 1em; margin: 1em 0; color: #6c757d; font-style: italic; }
        .blog-overview-content pre { background: #2d2d2d; color: #f8f8f2; padding: 1em; border-radius: 6px; overflow-x: auto; margin-bottom: 1em; font-family: monospace; font-size: 0.9em; }
        .blog-overview-content code { background: #f3f6f9; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em; }
        .blog-overview-content a { color: #405189; text-decoration: underline; }
        .blog-overview-content img { max-width: 100%; border-radius: 6px; margin: 1em 0; }
        .blog-overview-content .ql-align-center { text-align: center; }
        .blog-overview-content .ql-align-right { text-align: right; }
        .blog-overview-content .ql-align-justify { text-align: left; }
        .blog-overview-content .ql-indent-1 { padding-left: 3em; }
        .blog-overview-content .ql-indent-2 { padding-left: 6em; }
        .blog-overview-content sub { vertical-align: sub; font-size: smaller; }
        .blog-overview-content sup { vertical-align: super; font-size: smaller; }
      `}</style>
    </div>
  );
}
