import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateButton, DraftButton, DeleteButton } from '../../components/ActionButtons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function AddBlogView() {
  const location = useLocation();
  const editData = location.state?.blogData;

  const [title, setTitle] = useState(editData?.title || '');
  const [slug, setSlug] = useState(editData ? editData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');
  const [content, setContent] = useState(editData?.desc || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(editData?.image || '');
  const [thumbnailAlt, setThumbnailAlt] = useState(editData?.altText || '');
  const [category, setCategory] = useState(editData?.category || '');
  const [tags, setTags] = useState(editData?.tags ? editData.tags.join(', ') : '');
  const [author, setAuthor] = useState(editData?.author || 'Admin User');
  const [metaTitle, setMetaTitle] = useState(editData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(editData?.metaDesc || '');
  const [publishedDate, setPublishedDate] = useState(
    editData?.publishedDate 
      ? new Date(editData.publishedDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [attachedFilesUrls, setAttachedFilesUrls] = useState(editData?.attachedFiles || []);
  
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFilesUploading, setIsFilesUploading] = useState(false);

  useEffect(() => {
    // Fetch categories for the dropdown
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        const activeCategories = data.filter(c => c.status === 'Active');
        setCategories(activeCategories);
        if (activeCategories.length > 0) setCategory(activeCategories[0].name);
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    // Add tooltips to Quill toolbar buttons after it renders
    const timer = setTimeout(() => {
      const tooltips = {
        'ql-bold': 'Bold', 'ql-italic': 'Italic', 'ql-underline': 'Underline', 'ql-strike': 'Strikethrough',
        'ql-script[value="sub"]': 'Subscript', 'ql-script[value="super"]': 'Superscript',
        'ql-header[value="1"]': 'Heading 1', 'ql-header[value="2"]': 'Heading 2',
        'ql-blockquote': 'Blockquote', 'ql-code-block': 'Code Block',
        'ql-list[value="ordered"]': 'Ordered List', 'ql-list[value="bullet"]': 'Bullet List',
        'ql-indent[value="-1"]': 'Decrease Indent', 'ql-indent[value="+1"]': 'Increase Indent',
        'ql-direction': 'Text Direction', 'ql-align': 'Alignment',
        'ql-link': 'Insert Link', 'ql-image': 'Insert Image', 'ql-video': 'Insert Video', 'ql-formula': 'Insert Formula',
        'ql-clean': 'Clear Formatting',
        'ql-color': 'Text Color', 'ql-background': 'Background Color',
        'ql-font': 'Font Family', 'ql-size': 'Font Size', 'ql-header': 'Header'
      };

      Object.entries(tooltips).forEach(([className, title]) => {
        const buttons = document.querySelectorAll(`button.${className}, span.${className}`);
        buttons.forEach(btn => btn.setAttribute('title', title));
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  // Thumbnail Image Dropzone
  const onDropThumbnail = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setThumbnailUrl(data.url);
        toast.success('Image uploaded to Cloudinary!');
      } else {
        toast.error('Upload failed: ' + data.message);
      }
    } catch (error) {
      toast.error('Server error during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps: getThumbRootProps, getInputProps: getThumbInputProps, isDragActive: isThumbDragActive } = useDropzone({
    onDrop: onDropThumbnail,
    accept: { 'image/*': [] },
    multiple: false
  });

  // Attached Files Dropzone
  const onDropFiles = async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error('File size must be under 5MB and a maximum of 2 files are allowed.');
      return;
    }

    if (attachedFilesUrls.length + acceptedFiles.length > 2) {
      toast.error('You can only upload a maximum of 2 files.');
      return;
    }

    if (acceptedFiles.length === 0) return;

    setIsFilesUploading(true);
    let newUrls = [...attachedFilesUrls];

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('image', file); // using same upload endpoint
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          newUrls.push(data.url);
        } else {
          toast.error(`Upload failed for ${file.name}: ` + data.message);
        }
      } catch (error) {
        toast.error(`Server error uploading ${file.name}`);
      }
    }
    
    setAttachedFilesUrls(newUrls);
    setIsFilesUploading(false);
    toast.success('Files uploaded successfully!');
  };

  const removeAttachedFile = (idx) => {
    setAttachedFilesUrls(attachedFilesUrls.filter((_, i) => i !== idx));
  };

  const { getRootProps: getFileRootProps, getInputProps: getFileInputProps, isDragActive: isFileDragActive } = useDropzone({
    onDrop: onDropFiles,
    maxSize: 5242880, // 5MB
    maxFiles: 2
  });

  const navigate = useNavigate();

  const handleSave = async (status) => {
    // Validate required fields for both
    if (!title.trim() || !content || content === '<p><br></p>' || !category) {
      toast.error('Please fill required fields: Title, Content, and Category');
      return;
    }

    // Additional validation for Publish (Active)
    if (status === 'Active') {
      if (!tags.trim() || !metaTitle.trim() || !metaDescription.trim()) {
        toast.error('Tags, Meta Title, and Meta Description are required to publish!');
        return;
      }
    }
    
    const blogData = {
      title,
      slug,
      desc: content,
      image: thumbnailUrl,
      altText: thumbnailAlt,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      author,
      metaTitle,
      metaDesc: metaDescription,
      status, // 'Active' or 'Draft'
      publishedDate,
      attachedFiles: attachedFilesUrls
    };

    try {
      let res;
      if (editData && editData._id) {
        // Update existing blog
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${editData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogData)
        });
      } else {
        // Create new blog
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogData)
        });
      }

      if (res.ok) {
        toast.success(`Blog ${status === 'Draft' ? 'saved as Draft' : 'published'} successfully!`);
        navigate(status === 'Draft' ? '/blogs/drafts' : '/blogs/list');
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.error || 'Failed to save blog'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error connecting to API');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave('Active');
  };

  const handleClearForm = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will clear all fields. You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0ab39c',
      cancelButtonColor: '#f06548',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setTitle('');
        setSlug('');
        setContent('');
        setThumbnailUrl('');
        setThumbnailAlt('');
        setTags('');
        setAuthor('Admin User');
        setMetaTitle('');
        setMetaDescription('');
        setAttachedFilesUrls([]);
        toast.success('Form cleared successfully.');
      }
    });
  };

  return (
    <div className="p-6 font-sans" style={{ backgroundColor: '#f3f6f9', minHeight: '100vh' }}>
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[15px] font-medium text-gray-700 uppercase tracking-wide">Create Blog</h4>
        <div className="text-[13px] text-gray-500">
          <span>Blogs</span> <span className="mx-1">/</span> <span className="text-gray-400">Create Blog</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Card */}
          <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)]">
            <div className="p-4 border-b border-[#e9ebec]">
              <h5 className="text-[15px] font-semibold text-[#495057]">Blog Details</h5>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-[#212529] mb-2">Blog Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter blog title"
                  className="w-full px-3 py-[0.5rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] focus:ring-0 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#212529] mb-2">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    className="w-full px-3 py-[0.5rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#212529] mb-2">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-friendly-slug"
                    className="w-full px-3 py-[0.5rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] bg-[#f3f6f9] focus:border-[#878a99] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#212529] mb-2">Thumbnail Image</label>
                  <div 
                    {...getThumbRootProps()} 
                    className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors min-h-[120px] flex flex-col items-center justify-center ${isThumbDragActive ? 'border-[#405189] bg-[#f3f6f9]' : 'border-[#ced4da] hover:bg-gray-50'}`}
                  >
                    <input {...getThumbInputProps()} />
                    {isUploading ? (
                      <div className="text-sm text-gray-500 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#405189] mb-2"></div>
                        Uploading to Cloudinary...
                      </div>
                    ) : thumbnailUrl ? (
                      <img src={thumbnailUrl} alt="Thumbnail preview" className="max-h-24 rounded object-cover" />
                    ) : (
                      <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
                        <ImageIcon size={24} className="text-gray-400" />
                        <span className="font-medium text-[#405189]">Click to upload</span> or drag and drop
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#212529] mb-2">Image Alt Text (SEO)</label>
                  <input
                    type="text"
                    value={thumbnailAlt}
                    onChange={(e) => setThumbnailAlt(e.target.value)}
                    placeholder="Describe the image for search engines..."
                    className="w-full px-3 py-[0.5rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Improves accessibility and image SEO.</p>
                </div>
              </div>

              <div>
                <style>
                  {`
                    .ql-editor {
                      min-height: 350px;
                      padding-bottom: 2rem !important;
                    }
                  `}
                </style>
                <label className="block text-[13px] font-medium text-[#212529] mb-2">Blog Description (Content) <span className="text-red-500">*</span></label>
                <div className="border border-[#ced4da] rounded-[0.25rem] bg-white">
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    className="pb-[2rem]" // Added padding bottom to prevent text getting cut off by the editor bounds
                    modules={{
                      toolbar: [
                        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],
                        [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }, { 'align': [] }],
                        ['link', 'image', 'video', 'formula'],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attached Files Card */}
          <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)]">
            <div className="p-4 border-b border-[#e9ebec]">
              <h5 className="text-[15px] font-semibold text-[#495057]">Attached files</h5>
            </div>
            <div className="p-6">
              <div 
                {...getFileRootProps()} 
                className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${isFileDragActive ? 'border-[#405189] bg-[#f3f6f9]' : 'border-[#ced4da] hover:bg-gray-50'}`}
              >
                <input {...getFileInputProps()} />
                <div className="bg-[#f3f6f9] p-4 rounded-full mb-3">
                  <UploadCloud size={32} className="text-[#405189]" />
                </div>
                <h5 className="text-[14px] font-medium text-[#212529] mb-1">
                  {isFilesUploading ? 'Uploading files...' : 'Drop files here or click to upload.'}
                </h5>
                <p className="text-[12px] text-gray-500">Max 2 files, up to 5MB each.</p>
              </div>

              {attachedFilesUrls.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h6 className="text-[13px] font-semibold text-gray-700">Uploaded Files ({attachedFilesUrls.length}/2):</h6>
                  {attachedFilesUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                      <a href={url} target="_blank" rel="noreferrer" className="text-[13px] text-[#405189] hover:underline truncate w-3/4">
                        {url.split('/').pop()}
                      </a>
                      <button 
                        type="button" 
                        onClick={() => removeAttachedFile(idx)}
                        className="text-red-500 text-sm hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Moved Action Buttons to bottom of Left Column */}
          <div className="flex justify-end gap-2 mt-2">
            <DeleteButton onClick={handleClearForm} />
            <DraftButton onClick={() => handleSave('Draft')} />
            <CreateButton onClick={handleSubmit} text={editData ? "Update Blog" : "Publish Now"} />
          </div>

        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Organization Card */}
          <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)]">
            <div className="p-4 border-b border-[#e9ebec]">
              <h5 className="text-[15px] font-semibold text-[#495057]">Organization</h5>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#212529] mb-2">Category <span className="text-red-500">*</span></label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-[0.5rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#212529] mb-2">Publish Date</label>
                <input
                  type="date"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className="w-full px-3 py-[0.5rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#212529] mb-2">Tags <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Design, Real Estate (comma separated)"
                  className="w-full px-3 py-[0.5rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEO Meta Card */}
          <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)]">
            <div className="p-4 border-b border-[#e9ebec]">
              <h5 className="text-[15px] font-semibold text-[#495057]">SEO Meta Data</h5>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#212529] mb-2">Meta Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO Title (50-60 chars)"
                  className="w-full px-3 py-[0.5rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#212529] mb-2">Meta Description <span className="text-red-500">*</span></label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO Description (150-160 chars)"
                  rows="4"
                  className="w-full px-3 py-[0.5rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
