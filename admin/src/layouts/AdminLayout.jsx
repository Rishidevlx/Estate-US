import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Settings } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const location = useLocation();

  const hideSettingsOnRoutes = ['/profile', '/security'];
  const showSettings = !hideSettingsOnRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f6f9]">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Navbar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        <main className="flex-1 overflow-y-auto mt-[70px] p-6 relative custom-scrollbar">
          <Outlet />
          
          {/* Global Floating Settings Button (Velzon Style) */}
          {showSettings && (
            <div className="fixed bottom-6 right-6 z-50">
              <button 
                onClick={() => window.location.href = '/profile'}
                className="bg-[#299cdb] text-white p-3 rounded-full shadow-lg hover:bg-[#258bbf] transition-colors"
              >
                <Settings size={20} className="animate-[spin_4s_linear_infinite]" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
