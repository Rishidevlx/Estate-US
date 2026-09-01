import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import Footer from '../components/Footer';
import '../blog.css';

export default function SingleBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogPost, setBlogPost] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [apiCategories, setApiCategories] = useState([]);
  const [allActiveBlogs, setAllActiveBlogs] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    // Fetch Single Blog
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setBlogPost(data);
          
          // Fetch all active blogs for related section & search
          fetch(`${import.meta.env.VITE_API_URL}/api/blogs?status=Active`)
            .then(r => r.json())
            .then(allBlogs => {
              setAllActiveBlogs(allBlogs);
              let related = allBlogs.filter(b => b.category === data.category && b._id !== data._id);
              if (related.length === 0) {
                related = allBlogs.filter(b => b._id !== data._id).slice(0, 3);
              } else {
                related = related.slice(0, 3);
              }
              setRelatedBlogs(related);
            });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    // Fetch categories
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        setApiCategories(data.filter(c => c.status === 'Active'));
      })
      .catch(err => console.error(err));

    // Handle click outside for search autocomplete dropdown
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id]);

  if (loading) {
    return (
      <div className="blog-page flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="blog-page">
        <h2 style={{textAlign: 'center', marginTop: '100px'}}>Blog not found</h2>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/blog" style={{color: 'var(--primary-green)'}}>Back to Blog</Link>
        </div>
      </div>
    );
  }

  // Autocomplete suggestions based on search query
  const searchSuggestions = allActiveBlogs.filter(blog => {
    if (!searchQuery.trim()) return false;
    return blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           blog.desc?.toLowerCase().includes(searchQuery.toLowerCase());
  }).slice(0, 6);

  const handleCategorySelect = (e) => {
    const category = e.target.value;
    if (category === 'All') {
      navigate('/blog');
    } else {
      navigate('/blog', { state: { category } });
    }
  };

  return (
    <div className="blog-page single-blog">
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
            <li><Link to="/blog" className="nav-link" style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>Blog</Link></li>
            <li><a href="/#contact" className="nav-link" style={{ color: '#333' }}>Contact</a></li>
          </ul>
          <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} color="#333" /> : <Menu size={28} color="#333" />}
          </div>
        </div>
      </nav>

      <main className="blog-container">

        {/* Search & Filter Bar */}
        <div className="search-filter-bar" style={{ position: 'relative', zIndex: 50, marginBottom: '40px' }}>
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
            defaultValue="All"
            onChange={handleCategorySelect}
          >
            <option value="All">All Categories</option>
            {apiCategories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Two-Column Layout */}
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Main Content */}
          <div style={{ flex: '1 1 65%', minWidth: 0, maxWidth: '100%' }}>
            <article className="single-article" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
              <div className="article-header" style={{ marginBottom: '30px' }}>
                <span className="article-category" style={{ display: 'inline-block', backgroundColor: '#f0f5f3', color: '#113C2B', padding: '6px 12px', borderRadius: '4px', marginBottom: '15px', fontWeight: '600' }}>
                  {blogPost.category}
                </span>
                <h1 className="article-title" style={{ marginTop: '0', marginBottom: '15px', fontSize: '2.5rem', lineHeight: '1.2' }}>{blogPost.title}</h1>
                <div className="post-meta article-meta" style={{ display: 'flex', gap: '20px', borderBottom: 'none', color: '#7c98b6' }}>
                  <span>By <strong style={{color: '#113C2B'}}>{blogPost.author}</strong></span>
                  <span>{blogPost.publishedDate ? new Date(blogPost.publishedDate).toLocaleDateString() : new Date(blogPost.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <img src={blogPost.image || "https://placehold.co/1000x500/113c2b/d4af37?text=Blog+Image"} alt={blogPost.title} className="article-hero-image" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '12px', marginBottom: '40px' }} />
              
              <div className="article-content ql-content" dangerouslySetInnerHTML={{__html: blogPost.desc.replace(/&nbsp;/g, ' ')}}>
              </div>

              {/* Attached Files Section */}
              {blogPost.attachedFiles && blogPost.attachedFiles.length > 0 && (
                <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#113C2B', marginBottom: '20px', fontWeight: '600', marginTop: 0 }}>Attached Files</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {blogPost.attachedFiles.map((fileUrl, idx) => {
                      const fileName = fileUrl.split('/').pop().split('?')[0];
                      
                      const handleDownload = async (e) => {
                        e.preventDefault();
                        try {
                          // Fetch the file as a blob to force download
                          const response = await fetch(fileUrl);
                          const blob = await response.blob();
                          const blobUrl = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = blobUrl;
                          link.download = fileName;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(blobUrl);
                        } catch (error) {
                          console.error("Download failed via fetch, opening in new tab", error);
                          window.open(fileUrl, '_blank'); // Fallback
                        }
                      };

                      return (
                        <li key={idx} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                            <span style={{ color: '#113C2B', fontSize: '1rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {fileName}
                            </span>
                          </div>
                          <button 
                            onClick={handleDownload}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f0f5f3', color: '#113C2B', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', flexShrink: 0 }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#113C2B'; e.currentTarget.style.color = '#fff'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f0f5f3'; e.currentTarget.style.color = '#113C2B'; }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </article>
          </div>

          {/* Right Sidebar */}
          <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#113C2B', borderBottom: '2px solid #d4af37', paddingBottom: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Recent Blogs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {allActiveBlogs.filter(b => b._id !== blogPost._id).slice(0, 3).map(post => (
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

              {/* Sidebar Categories (Optional addition for neatness) */}
              <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#113C2B', borderBottom: '2px solid #d4af37', paddingBottom: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Categories</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {apiCategories.map(cat => (
                    <li key={cat._id} style={{ borderBottom: '1px solid #eaeaea', padding: '10px 0' }}>
                      <button 
                        onClick={() => handleCategorySelect({ target: { value: cat.name } })}
                        style={{ background: 'none', border: 'none', color: '#516f90', cursor: 'pointer', fontSize: '1rem', padding: 0, textAlign: 'left', width: '100%' }}
                        onMouseOver={(e) => e.target.style.color='#d4af37'} onMouseOut={(e) => e.target.style.color='#516f90'}
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

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="related-section" style={{ marginTop: '60px', borderTop: '1px solid #eaeaea', paddingTop: '40px' }}>
            <div className="section-header">
              <h2>Related Articles</h2>
            </div>
            <div className="post-grid">
              {relatedBlogs.map(post => (
                <div key={post._id} className="grid-card">
                  <Link to={`/blog/${post.slug || post._id}`}>
                    <img src={post.image || "https://placehold.co/400x250/e0e0e0/555?text=Related"} alt={post.title} />
                  </Link>
                  <div className="card-content">
                    <h4><Link to={`/blog/${post.slug || post._id}`}>{post.title}</Link></h4>
                    <p>{post.desc.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').slice(0, 100)}...</p>
                    <div className="post-meta text-sm">
                      <span>{post.category}</span>
                      <span>{post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <style>{`
        .ql-content {
          overflow-wrap: break-word !important;
          word-break: normal !important;
          word-wrap: normal !important;
          hyphens: none !important;
          max-width: 100%;
        }
        .ql-content * {
          word-break: normal !important;
        }
        .ql-content h1 { font-size: 2.2em; font-weight: bold; margin: 1em 0 0.5em; color: #113C2B; line-height: 1.3; }
        .ql-content h2 { font-size: 1.8em; font-weight: bold; margin: 1em 0 0.5em; color: #113C2B; line-height: 1.3; }
        .ql-content h3 { font-size: 1.5em; font-weight: bold; margin: 0.8em 0 0.4em; color: #113C2B; line-height: 1.4; }
        .ql-content h4, .ql-content h5, .ql-content h6 { font-weight: bold; margin: 0.8em 0; color: #113C2B; }
        .ql-content p { margin-bottom: 1.4em; font-size: 1.1rem; line-height: 1.8; color: #495057; max-width: 100%; }
        .ql-content ul { list-style: disc; padding-left: 2.5em; margin-bottom: 1.4em; font-size: 1.1rem; color: #495057; }
        .ql-content ol { list-style: decimal; padding-left: 2.5em; margin-bottom: 1.4em; font-size: 1.1rem; color: #495057; }
        .ql-content li { margin-bottom: 0.6em; }
        .ql-content strong { font-weight: bold; }
        .ql-content em { font-style: italic; }
        .ql-content u { text-decoration: underline; }
        .ql-content s { text-decoration: line-through; }
        .ql-content blockquote { border-left: 4px solid #d4af37; padding: 0.5em 1.5em; margin: 2em 0; color: #516f90; font-style: italic; background: #f9f9f6; border-radius: 0 8px 8px 0; font-size: 1.15rem; }
        .ql-content pre { background: #23272e; color: #abb2bf; padding: 1.5em; border-radius: 8px; overflow-x: auto; margin-bottom: 1.5em; font-family: 'Consolas', 'Courier New', monospace; font-size: 0.95em; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; max-width: 100%; box-shadow: inset 0 0 10px rgba(0,0,0,0.1); }
        .ql-content code { background: #f3f4f6; padding: 0.2em 0.5em; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #e83e8c; }
        .ql-content a { color: #113C2B; text-decoration: underline; font-weight: 500; }
        .ql-content a:hover { color: #d4af37; }
        .ql-content img { max-width: 100%; border-radius: 8px; margin: 2em 0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .ql-content .ql-align-center { text-align: center; }
        .ql-content .ql-align-right { text-align: right; }
        .ql-content .ql-align-justify { text-align: left; /* Forced left to prevent huge gaps in browser */ }
        .ql-content .ql-indent-1 { padding-left: 3em; }
        .ql-content .ql-indent-2 { padding-left: 6em; }
        .ql-content sub { vertical-align: sub; font-size: smaller; }
        .ql-content sup { vertical-align: super; font-size: smaller; }
        .ql-content .ql-syntax { background: #23272e; color: #abb2bf; padding: 1.5em; border-radius: 8px; overflow-x: auto; display: block; font-family: 'Consolas', monospace; font-size: 0.95em; white-space: pre-wrap; word-wrap: break-word; max-width: 100%; }
        
        .single-article {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
