import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import '../blog.css';

export default function Blog() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'All');
  const [apiCategories, setApiCategories] = useState([]);
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        // Use only active categories
        const activeCategories = data.filter(c => c.status === 'Active');
        setApiCategories(activeCategories);
      })
      .catch(err => console.error('Failed to fetch categories:', err));

    // Fetch active blogs from the backend
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs?status=Active`)
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error('Failed to fetch blogs:', err));

    // Handle click outside for search autocomplete dropdown
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter ONLY by category
  const filteredBlogs = blogs.filter(blog => {
    return selectedCategory === 'All' || blog.category === selectedCategory;
  });

  // Autocomplete suggestions based on search query
  const searchSuggestions = blogs.filter(blog => {
    if (!searchQuery.trim()) return false;
    return blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           blog.desc?.toLowerCase().includes(searchQuery.toLowerCase());
  }).slice(0, 6);

  const featuredPost = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const gridPosts = filteredBlogs.slice(1);

  return (
    <div className="blog-page">
      {/* Navbar */}
      <nav className="navbar" style={{ backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #eaeaea' }}>
        <div className="container nav-container">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <a href="/">
              <img className="sampras-logo" src="/estate-removebg-preview.png" alt="Sampras Realty" style={{ height: '45px' }} />
            </a>
            <img src="/homesmart-logo-new.png" alt="HomeSmart" style={{ height: '30px' }} />
          </div>
          <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
            <li><a href="/#home" className="nav-link" style={{ color: '#333' }}>Home</a></li>
            <li><a href="/#about" className="nav-link" style={{ color: '#333' }}>About</a></li>
            <li><a href="/#services" className="nav-link" style={{ color: '#333' }}>Services</a></li>
            <li><a href="/blog" className="nav-link" style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>Blog</a></li>
            <li><a href="/#contact" className="nav-link" style={{ color: '#333' }}>Contact</a></li>
          </ul>
          <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} color="#333" /> : <Menu size={28} color="#333" />}
          </div>
        </div>
      </nav>

      <main className="blog-container">
        
        {/* Search & Filter Bar */}
        <div className="search-filter-bar" style={{ position: 'relative', zIndex: 50 }}>
          <div className="search-input-wrapper" ref={searchContainerRef} style={{ position: 'relative', flex: 1 }}>
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search blogs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="blog-search-input"
            />
            
            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim() !== '' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'white', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginTop: '8px', overflow: 'hidden', zIndex: 1000 }}>
                {searchSuggestions.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {searchSuggestions.map(post => (
                      <li key={post._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <Link 
                          to={`/blog/${post.slug || post._id}`} 
                          style={{ display: 'block', padding: '15px 20px', color: '#113C2B', textDecoration: 'none', fontWeight: 500, transition: 'background 0.2s' }}
                          onClick={() => setIsSearchFocused(false)}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <span style={{ display: 'block', fontSize: '1rem', marginBottom: '4px' }}>{post.title}</span>
                          <span style={{ fontSize: '0.8rem', color: '#7c98b6' }}>in {post.category}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ padding: '20px', color: '#7c98b6', textAlign: 'center' }}>No results found</div>
                )}
              </div>
            )}
          </div>

          <select 
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {apiCategories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {filteredBlogs.length === 0 && (
          <div className="no-results">
            <h3>No blogs found for this category.</h3>
          </div>
        )}

        {/* Two-Column Layout */}
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '30px' }}>
          
          {/* Left Main Content */}
          <div style={{ flex: '1 1 65%', minWidth: 0, maxWidth: '100%' }}>

        {/* Top Section - HubSpot Style */}
        {featuredPost && (
          <section className="featured-section">
            <div className="featured-main">
              <Link to={`/blog/${featuredPost.slug || featuredPost._id}`}>
                <img src={featuredPost.image || 'https://placehold.co/800x400/e0e0e0/555?text=Featured'} alt="Featured Post" className="featured-img" />
              </Link>
              <h1 className="featured-title">
                <Link to={`/blog/${featuredPost.slug || featuredPost._id}`}>{featuredPost.title}</Link>
              </h1>
              <div className="featured-desc-wrapper" style={{ maxHeight: '72px', overflow: 'hidden', marginTop: '15px', marginBottom: '15px' }}>
                <div 
                  className="featured-desc" 
                  dangerouslySetInnerHTML={{ __html: featuredPost.desc.replace(/&nbsp;/g, ' ') }}
                />
              </div>
              <div className="post-meta">
                <span>{featuredPost.category}</span>
                <span>{featuredPost.author}</span>
                <span>{featuredPost.date}</span>
              </div>
            </div>
            
          </section>
        )}

        {/* Categories / Grid Section */}
        {gridPosts.length > 0 && (
          <section className="grid-section">
            <div className="section-header">
              <h2>More Articles</h2>
            </div>
            <div className="post-grid">
              {gridPosts.map(post => (
                <div key={post._id} className="grid-card">
                  <Link to={`/blog/${post.slug || post._id}`}>
                    <img src={post.image} alt={post.title} />
                  </Link>
                  <div className="card-content">
                    <h4><Link to={`/blog/${post.slug || post._id}`}>{post.title}</Link></h4>
                    <p>{post.desc.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').slice(0, 100)}...</p>
                    <div className="post-meta text-sm">
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
          </div>

          {/* Right Sidebar */}
          <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#113C2B', borderBottom: '2px solid #d4af37', paddingBottom: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Recent Blogs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {blogs.slice(0, 3).map(post => (
                    <div key={post._id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <Link to={`/blog/${post.slug || post._id}`} style={{ flexShrink: 0 }}>
                        <img src={post.image || "https://placehold.co/150x150/e0e0e0/555?text=Blog"} alt={post.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                      </Link>
                      <div>
                        <Link to={`/blog/${post.slug || post._id}`} style={{ color: '#113C2B', textDecoration: 'none', fontWeight: '600', fontSize: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} onMouseOver={(e) => e.target.style.color='#d4af37'} onMouseOut={(e) => e.target.style.color='#113C2B'}>
                          {post.title}
                        </Link>
                        <div style={{ fontSize: '0.85rem', color: '#7c98b6', marginTop: '5px' }}>
                          {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#113C2B', borderBottom: '2px solid #d4af37', paddingBottom: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Categories</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ borderBottom: '1px solid #eaeaea', padding: '10px 0' }}>
                    <button 
                      onClick={() => setSelectedCategory('All')}
                      style={{ background: 'none', border: 'none', color: selectedCategory === 'All' ? '#d4af37' : '#516f90', fontWeight: selectedCategory === 'All' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1rem', padding: 0, textAlign: 'left', width: '100%' }}
                      onMouseOver={(e) => e.target.style.color='#d4af37'} onMouseOut={(e) => { if(selectedCategory !== 'All') e.target.style.color='#516f90' }}
                    >
                      All Categories
                    </button>
                  </li>
                  {apiCategories.map(cat => (
                    <li key={cat._id} style={{ borderBottom: '1px solid #eaeaea', padding: '10px 0' }}>
                      <button 
                        onClick={() => setSelectedCategory(cat.name)}
                        style={{ background: 'none', border: 'none', color: selectedCategory === cat.name ? '#d4af37' : '#516f90', fontWeight: selectedCategory === cat.name ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1rem', padding: 0, textAlign: 'left', width: '100%' }}
                        onMouseOver={(e) => e.target.style.color='#d4af37'} onMouseOut={(e) => { if(selectedCategory !== cat.name) e.target.style.color='#516f90' }}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
