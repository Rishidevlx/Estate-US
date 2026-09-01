import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ChevronDown, 
  Contact, 
  User, 
  Shield, 
  LogOut,
  PenTool,
  Tags,
  Info,
  MessageSquare,
  FileEdit
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed }) => {
  const [contentOpen, setContentOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className={`sidebar-font bg-[#113C2B] text-white h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-[70px] flex items-center justify-center border-b border-white/10 overflow-hidden">
        {isCollapsed ? (
          <img src="/estate.jpg" alt="Logo" className="h-10 w-10 object-cover rounded-md" />
        ) : (
          <div className="flex items-center gap-3">
            <img src="/estate.jpg" alt="Sampras Logo" className="h-10 w-auto object-contain rounded-md" />
            <h2 className="text-xl font-bold tracking-wider">SAMPRAS</h2>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className={`flex-1 py-4 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto custom-scrollbar'}`}>
        {!isCollapsed && <p className="px-6 text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 mt-2">Menu</p>}

        <ul className="flex flex-col gap-1 px-3">
          {/* Dashboard */}
          <li>
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isActive('/dashboard') ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutDashboard size={20} />
              {!isCollapsed && <span className="font-medium">Dashboard</span>}
            </Link>
          </li>

          {/* Content (Dropdown) */}
          <li className="relative group">
            <div 
              onClick={() => !isCollapsed && setContentOpen(!contentOpen)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors text-gray-300 hover:text-white hover:bg-white/5`}
            >
              <div className="flex items-center gap-3">
                <FileText size={20} />
                {!isCollapsed && <span className="font-medium">Content</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown size={16} className={`transition-transform duration-200 ${contentOpen ? 'rotate-180' : ''}`} />
              )}
            </div>
            
            {/* Submenu */}
            <ul className={`
              ${!isCollapsed 
                ? (contentOpen ? 'mt-1 flex flex-col gap-1 pl-9 pr-3' : 'hidden') 
                : 'hidden group-hover:flex absolute left-[70px] -top-2 w-52 bg-[#113C2B] rounded-r-md shadow-2xl py-2 flex-col gap-1 z-[100] border border-white/10'
              }
            `}>
              {isCollapsed && (
                <li className="px-4 py-3 mb-1 border-b border-white/10 bg-[#0f3426]">
                  <span className="text-white font-semibold text-[14px]">Content</span>
                </li>
              )}
              <li>
                <Link 
                  to="/blogs/add" 
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-md transition-colors ${location.pathname === '/blogs/add' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5 mx-2'}`}
                >
                  <FileEdit size={16} /> Add Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/blogs/drafts" 
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-md transition-colors ${location.pathname === '/blogs/drafts' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5 mx-2'}`}
                >
                  <FileText size={16} /> Drafts
                </Link>
              </li>
              <li>
                <Link to="/blogs/list" className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-md transition-colors ${isActive('/blogs/list') ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5 mx-2'}`}>
                  <FileText size={16} /> All Blogs
                </Link>
              </li>
              <li>
                <Link to="/blogs/categories" className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-md transition-colors ${isActive('/blogs/categories') ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5 mx-2'}`}>
                  <Tags size={16} /> Categories
                </Link>
              </li>
              <li>
                <Link 
                  to="/content/founder" 
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-md transition-colors ${location.pathname === '/content/founder' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5 mx-2'}`}
                >
                  <User size={16} /> Founder Details
                </Link>
              </li>
            </ul>
          </li>

          {/* Contacts (Dropdown) */}
          <li className="relative group">
            <div 
              onClick={() => !isCollapsed && setContactsOpen(!contactsOpen)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors text-gray-300 hover:text-white hover:bg-white/5`}
            >
              <div className="flex items-center gap-3">
                <Contact size={20} />
                {!isCollapsed && <span className="font-medium">Contacts</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown size={16} className={`transition-transform duration-200 ${contactsOpen ? 'rotate-180' : ''}`} />
              )}
            </div>
            
            {/* Submenu */}
            <ul className={`
              ${!isCollapsed 
                ? (contactsOpen ? 'mt-1 flex flex-col gap-1 pl-9 pr-3' : 'hidden') 
                : 'hidden group-hover:flex absolute left-[70px] -top-2 w-52 bg-[#113C2B] rounded-r-md shadow-2xl py-2 flex-col gap-1 z-[100] border border-white/10'
              }
            `}>
              {isCollapsed && (
                <li className="px-4 py-3 mb-1 border-b border-white/10 bg-[#0f3426]">
                  <span className="text-white font-semibold text-[14px]">Contacts</span>
                </li>
              )}
              <li>
                <Link to="/contacts/info" className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-md transition-colors ${location.pathname === '/contacts/info' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5 mx-2'}`}>
                  <Info size={16} /> Contact Info
                </Link>
              </li>
              <li>
                <Link to="/contacts/enquiries" className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-md transition-colors ${location.pathname === '/contacts/enquiries' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5 mx-2'}`}>
                  <MessageSquare size={16} /> Enquiries
                </Link>
              </li>
            </ul>
          </li>

          {!isCollapsed && <p className="px-6 text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 mt-4">Settings</p>}

          {/* Profile */}
          <li>
            <Link to="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${location.pathname === '/profile' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
              <User size={20} />
              {!isCollapsed && <span className="font-medium">Profile</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md transition-colors text-red-400 hover:bg-red-400/10 hover:text-red-300"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
