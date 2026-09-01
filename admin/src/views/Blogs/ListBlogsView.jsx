import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Edit2, Trash2, Frown } from 'lucide-react';
import { AddNewButton, DraftButton } from '../../components/ActionButtons';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function ListBlogsView() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('All');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch blogs and categories
  const fetchData = async () => {
    try {
      const [blogRes, catRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/blogs?status=Active`),
        fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      ]);
      if (blogRes.ok) setBlogs(await blogRes.json());
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.map(c => c.name));
      }
    } catch (error) {
      toast.error('Failed to connect to database');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
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
            setBlogs(blogs.filter(b => b._id !== id));
          } else {
            Swal.fire('Failed!', 'Could not delete blog.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'Server error.', 'error');
        }
      }
    });
  };

  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    // 1. Search term filter
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category filter
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    
    // 3. Time filter
    let matchesTime = true;
    const blogDate = new Date(blog.publishedDate || blog.createdAt);
    const now = new Date();
    
    if (timeFilter === 'Today') {
      matchesTime = blogDate.toDateString() === now.toDateString();
    } else if (timeFilter === 'Yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      matchesTime = blogDate.toDateString() === yesterday.toDateString();
    } else if (timeFilter === 'Last 7 Days') {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesTime = blogDate >= sevenDaysAgo;
    } else if (timeFilter === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesTime = blogDate >= thirtyDaysAgo;
    } else if (timeFilter === 'This Month') {
      matchesTime = blogDate.getMonth() === now.getMonth() && blogDate.getFullYear() === now.getFullYear();
    } else if (timeFilter === 'Last Year') {
      matchesTime = blogDate.getFullYear() === now.getFullYear() - 1;
    }

    return matchesSearch && matchesCategory && matchesTime;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  return (
    <div className="p-6 font-sans bg-[#f3f6f9] min-h-screen">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[15px] font-medium text-gray-700 uppercase tracking-wide">List View</h4>
        <div className="text-[13px] text-gray-500">
          <span>Blogs</span> <span className="mx-1">/</span> <span className="text-gray-400">List View</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)] p-5">
            <h5 className="text-[13px] font-semibold text-[#878a99] uppercase tracking-wider mb-3">Search Category</h5>
            <div className="relative mb-6">
              <input 
                type="text"
                placeholder="Search Categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-[0.45rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] bg-[#f3f6f9] focus:border-[#878a99] outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
            </div>

            <h5 className="text-[13px] font-semibold text-[#878a99] uppercase tracking-wider mb-3">Categories</h5>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className={`flex items-center text-[14px] w-full text-left transition-colors ${selectedCategory === 'All' ? 'text-[#405189] font-medium' : 'text-gray-600 hover:text-[#405189]'}`}
                >
                  <ChevronRight size={14} className={`mr-2 ${selectedCategory === 'All' ? 'text-[#405189]' : 'text-gray-400'}`} />
                  All Categories
                </button>
              </li>
              {categories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())).map((cat, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center text-[14px] w-full text-left transition-colors ${selectedCategory === cat ? 'text-[#405189] font-medium' : 'text-gray-600 hover:text-[#405189]'}`}
                  >
                    <ChevronRight size={14} className={`mr-2 ${selectedCategory === cat ? 'text-[#405189]' : 'text-gray-400'}`} />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          
          {/* Header Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <AddNewButton to="/blogs/add" />
              <DraftButton onClick={() => navigate('/blogs/drafts')} />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-8 pr-3 py-[0.45rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none"
                />
                <Search className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                
                {/* Search Dropdown */}
                {searchTerm && filteredBlogs.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-[#ced4da] rounded shadow-lg z-20 py-1">
                    {filteredBlogs.slice(0, 5).map(blog => (
                      <div 
                        key={blog._id} 
                        onClick={() => { navigate(`/blogs/view/${blog._id}`); setSearchTerm(''); }}
                        className="px-3 py-2 hover:bg-[#f3f6f9] cursor-pointer flex items-center gap-2 border-b border-gray-50 last:border-0"
                      >
                        <img src={blog.image || 'https://placehold.co/40'} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium text-gray-700 line-clamp-1">{blog.title}</p>
                          <p className="text-[10px] text-gray-500 line-clamp-1">{blog.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className="w-36 flex items-center justify-between px-3 py-[0.45rem] text-[13px] border border-[#ced4da] rounded-[0.25rem] bg-white hover:border-[#878a99] outline-none"
                >
                  {timeFilter}
                  <ChevronRight size={14} className={`transform transition-transform ${isTimeDropdownOpen ? 'rotate-90' : ''}`} />
                </button>
                
                {isTimeDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-[#ced4da] rounded shadow-lg z-10 py-1">
                    {['All', 'Last 7 Days', 'Last 30 Days', 'Last Year', 'This Month', 'Today', 'Yesterday'].map(option => (
                      <div 
                        key={option}
                        onClick={() => { setTimeFilter(option); setIsTimeDropdownOpen(false); }}
                        className="px-4 py-1.5 text-[13px] text-gray-700 hover:bg-[#f3f6f9] cursor-pointer"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredBlogs.length === 0 ? (
            <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-sm p-12 flex flex-col items-center justify-center text-gray-500">
              <Frown size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Blogs Found</h3>
              <p className="text-sm">We couldn't find any active blogs matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentBlogs.map((blog) => (
                <div key={blog._id} className="group bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)] flex flex-col sm:flex-row overflow-hidden transition-shadow hover:shadow-md relative">
                  
                  {/* Hover Action Icons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => navigate('/blogs/add', { state: { blogData: blog } })}
                      className="p-1.5 bg-blue-50 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors border border-blue-100"
                      title="Edit Blog"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors border border-red-100"
                      title="Delete Blog"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="w-full sm:w-[280px] h-48 sm:h-auto flex-shrink-0 relative">
                    <img src={blog.image || 'https://placehold.co/400x250/e0e0e0/555?text=No+Image'} alt={blog.title} className="w-full h-full object-cover p-3 rounded-xl" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center relative">
                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      {blog.category}
                    </div>
                    <h4 className="text-[16px] font-semibold text-[#495057] mb-2 hover:text-[#405189] cursor-pointer transition-colors line-clamp-2 pr-16">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-3">
                      <span>Published: {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="text-gray-300">|</span>
                      <span>Last Edited: {new Date(blog.updatedAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Convert HTML desc to plain text for preview */}
                    <div className="text-[13px] text-gray-500 mb-3 line-clamp-2 pr-12" dangerouslySetInnerHTML={{__html: blog.desc}}></div>
                    
                    <div className="mt-auto">
                      <Link to={`/blogs/view/${blog._id}`} className="text-[13px] font-medium text-[#405189] hover:underline mb-3 inline-block">
                        Read more <ChevronRight size={14} className="inline align-middle" />
                      </Link>
                      <div className="flex gap-2">
                        {blog.tags && blog.tags.map((tag, idx) => (
                          <span key={idx} className="text-[11px] font-medium text-[#0ab39c] bg-[#0ab39c]/10 px-2 py-0.5 rounded">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end mt-6">
              <div className="flex items-center gap-1 bg-white border border-[#e9ebec] rounded shadow-sm px-2 py-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50 rounded"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 text-sm rounded ${currentPage === i + 1 ? 'bg-[#0ab39c] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
