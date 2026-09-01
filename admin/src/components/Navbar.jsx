import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Maximize, Bell, ChevronDown, CheckCircle, MessageSquare, User, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [todayEnquiries, setTodayEnquiries] = useState([]);
  const [userData, setUserData] = useState({});
  const [lastReadAt, setLastReadAt] = useState(localStorage.getItem('lastReadAt') || null);
  
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Add Blog', path: '/blogs/add' },
    { name: 'Drafts', path: '/blogs/drafts' },
    { name: 'All Blogs', path: '/blogs/list' },
    { name: 'Categories', path: '/blogs/categories' },
    { name: 'Contact Info', path: '/contacts/info' },
    { name: 'Enquiries', path: '/contacts/enquiries' },
    { name: 'Profile Settings', path: '/profile' }
  ];

  const filteredMenus = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchTodayEnquiries();
    
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUserData(storedUser);
    };
    loadUser();
    
    window.addEventListener('userUpdated', loadUser);
    
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearchDropdown(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('userUpdated', loadUser);
    };
  }, []);

  const fetchTodayEnquiries = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/contact/enquiries/today`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTodayEnquiries(data);
      }
    } catch (error) {
      console.error('Failed to fetch today enquiries:', error);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " HOURS AGO";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " MIN AGO";
    return Math.floor(seconds) + " SEC AGO";
  };

  // Get initials for avatar
  const getInitials = () => {
    const first = userData.firstName?.charAt(0) || '';
    const last = userData.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'A';
  };

  const unreadCount = todayEnquiries.filter(e => !lastReadAt || new Date(e.createdAt) > new Date(lastReadAt)).length;

  const handleReadAll = (e) => {
    e.stopPropagation();
    const now = new Date().toISOString();
    setLastReadAt(now);
    localStorage.setItem('lastReadAt', now);
  };

  return (
    <div 
      className={`h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-50 transition-all duration-300 ${
        isCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Left side: Toggle & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none"
        >
          <Menu size={24} />
        </button>
        
        <div className="relative hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2 w-64 focus-within:border-[#113C2B] focus-within:ring-1 focus-within:ring-[#113C2B] transition-all" ref={searchRef}>
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search menus..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full text-gray-700 placeholder-gray-400"
          />
          
          {/* Search Dropdown */}
          {showSearchDropdown && searchQuery && (
            <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg py-2 z-20 max-h-60 overflow-y-auto custom-scrollbar">
              {filteredMenus.length > 0 ? (
                filteredMenus.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleMenuClick(item.path)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
                  >
                    <Search size={14} className="text-gray-400" />
                    {item.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <button onClick={toggleFullScreen} className="hidden md:flex p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
          <Maximize size={20} />
        </button>
        
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border border-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute top-[120%] right-0 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden flex flex-col">
              <div className="bg-[#405189] px-4 py-3 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <h6 className="font-semibold text-[15px] m-0">Notifications</h6>
                  {unreadCount > 0 && (
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-medium">{unreadCount} New</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleReadAll}
                    className="text-[11px] text-white/80 hover:text-white underline font-medium"
                  >
                    Read All
                  </button>
                )}
              </div>
              <div className="flex border-b border-gray-100 bg-gray-50">
                <button className="flex-1 py-2 text-[13px] font-semibold text-[#405189] border-b-2 border-[#405189]">All ({todayEnquiries.length})</button>
                {/* <button className="flex-1 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-700">Messages</button> */}
                {/* <button className="flex-1 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-700">Alerts</button> */}
              </div>
              
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {todayEnquiries.length > 0 ? (
                  todayEnquiries.map((enq, index) => (
                    <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex gap-3 group transition-colors">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <MessageSquare size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-semibold text-gray-900">{enq.name}</span> sent a new enquiry: "{enq.subject || 'No Subject'}"
                        </p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span> {timeAgo(enq.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                    <CheckCircle size={32} className="text-emerald-500 opacity-50" />
                    <span className="text-sm">No new enquiries today</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)} 
            className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 text-[#113C2B] flex items-center justify-center font-bold text-sm overflow-hidden">
              {userData.profilePic ? (
                <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials()
              )}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-800">{userData.firstName || 'Admin'} {userData.lastName || ''}</span>
              <span className="text-xs text-gray-500">{userData.designation || userData.role || 'Admin'}</span>
            </div>
            <ChevronDown size={16} className="text-gray-500 hidden md:block" />
          </button>
          
          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute top-[120%] right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
              <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                <p className="text-[13px] font-medium text-gray-500 m-0">Welcome {userData.firstName || 'Admin'}!</p>
              </div>
              <button 
                onClick={() => { navigate('/profile'); setProfileOpen(false); }} 
                className="w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <User size={16} className="text-gray-400" /> Personal Details
              </button>
              <button 
                onClick={() => { navigate('/profile'); setProfileOpen(false); }} 
                className="w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Shield size={16} className="text-gray-400" /> Security
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-2 text-[14px] text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} className="text-red-400" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
