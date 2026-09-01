import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  MessageSquare, 
  Tags, 
  Eye, 
  Settings, 
  Plus, 
  ChevronRight 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const DashboardView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalBlogs: 0,
      activeEnquiries: 0,
      totalCategories: 0,
      totalDrafts: 0
    },
    chartData: [],
    recentEnquiries: [],
    recentBlogs: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: "TOTAL BLOGS", 
      value: data.stats.totalBlogs, 
      change: "+12.5%", 
      isPositive: true,
      color: "bg-[#405189]", // Velzon Blue
      icon: <FileText size={24} className="text-white/80" />
    },
    { 
      title: "ACTIVE ENQUIRIES", 
      value: data.stats.activeEnquiries, 
      change: "+5.2%", 
      isPositive: true,
      color: "bg-[#0ab39c]", // Velzon Green
      icon: <MessageSquare size={24} className="text-white/80" />
    },
    { 
      title: "TOTAL CATEGORIES", 
      value: data.stats.totalCategories, 
      change: "-2.1%", 
      isPositive: false,
      color: "bg-[#f06548]", // Velzon Red
      icon: <Tags size={24} className="text-white/80" />
    },
    { 
      title: "TOTAL DRAFTS", 
      value: data.stats.totalDrafts, 
      change: "", 
      isPositive: true,
      color: "bg-[#299cdb]", // Velzon Cyan
      icon: <Eye size={24} className="text-white/80" />
    }
  ];

  if (loading) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#113C2B]"></div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Good Morning, Admin!</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your CMS today.</p>
        </div>
        <div className="text-sm text-gray-500 hidden md:block">
          Admin / <span className="text-[#113C2B]">Dashboard</span>
        </div>
      </div>
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, i) => (
          <div key={i} className={`${stat.color} p-5 rounded-md shadow-sm border border-transparent flex flex-col relative overflow-hidden text-white`}>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="font-semibold text-[13px] tracking-wider opacity-80">{stat.title}</h3>
              <span className={`text-[12px] font-medium px-2 py-1 rounded bg-white/20 flex items-center gap-1`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </span>
            </div>
            <div className="flex justify-between items-end relative z-10">
              <h2 className="text-3xl font-bold">{stat.value}</h2>
              <div className="bg-white/10 p-3 rounded-md">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Middle Section: Chart & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left Side: Chart (approx 60-70%) */}
        <div className="lg:col-span-8 bg-white rounded-md shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h6 className="text-[14px] font-semibold text-gray-700 uppercase tracking-wider m-0">Overview Analytics</h6>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">Last 6 Months</span>
          </div>
          <div className="p-4 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="enquiries" name="Enquiries" fill="#0ab39c" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="blogs" name="Blogs Published" fill="#405189" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Quick Shortcuts (approx 30-40%) */}
        <div className="lg:col-span-4 bg-white rounded-md shadow-sm border border-gray-100 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h6 className="text-[14px] font-semibold text-gray-700 uppercase tracking-wider m-0">Quick Shortcuts</h6>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center gap-4">
            <Link to="/blogs/add" className="flex items-center justify-between p-4 rounded-md border border-gray-100 hover:border-[#113C2B] hover:shadow-md transition-all group bg-gray-50 hover:bg-white">
              <div className="flex items-center gap-4">
                <div className="bg-[#113C2B] text-white p-3 rounded-md group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <div>
                  <h6 className="font-semibold text-gray-800 text-sm m-0">Write a New Blog</h6>
                  <p className="text-xs text-gray-500 m-0 mt-1">Publish content immediately</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-[#113C2B]" />
            </Link>

            <Link to="/contacts/enquiries" className="flex items-center justify-between p-4 rounded-md border border-gray-100 hover:border-[#0ab39c] hover:shadow-md transition-all group bg-gray-50 hover:bg-white">
              <div className="bg-[#0ab39c] text-white p-3 rounded-md group-hover:scale-110 transition-transform">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1 ml-4">
                <h6 className="font-semibold text-gray-800 text-sm m-0">View Enquiries</h6>
                <p className="text-xs text-gray-500 m-0 mt-1">Respond to customer leads</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-[#0ab39c]" />
            </Link>

            <Link to="/profile" className="flex items-center justify-between p-4 rounded-md border border-gray-100 hover:border-[#299cdb] hover:shadow-md transition-all group bg-gray-50 hover:bg-white">
              <div className="bg-[#299cdb] text-white p-3 rounded-md group-hover:scale-110 transition-transform">
                <Settings size={20} />
              </div>
              <div className="flex-1 ml-4">
                <h6 className="font-semibold text-gray-800 text-sm m-0">Profile Settings</h6>
                <p className="text-xs text-gray-500 m-0 mt-1">Update your account details</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-[#299cdb]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section 1: Recent Enquiries Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100 mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h6 className="text-[14px] font-semibold text-gray-700 uppercase tracking-wider m-0">Recent Enquiries</h6>
          <Link to="/contacts/enquiries" className="text-xs font-medium text-[#113C2B] hover:underline bg-[#113C2B]/10 px-2 py-1 rounded">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f3f6f9] text-gray-500 text-[13px] uppercase tracking-wider border-b border-gray-200">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Subject</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentEnquiries.length > 0 ? (
                data.recentEnquiries.map((enq) => (
                  <tr key={enq._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-800 font-medium">{enq.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{enq.email}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 max-w-[200px] truncate">{enq.subject}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{new Date(enq.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider ${
                        enq.status?.toLowerCase() === 'new' ? 'bg-blue-100 text-blue-600' :
                        enq.status?.toLowerCase() === 'inprogress' ? 'bg-orange-100 text-orange-600' :
                        enq.status?.toLowerCase() === 'on-hold' ? 'bg-gray-100 text-gray-600' :
                        enq.status?.toLowerCase() === 'closed' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {enq.status || 'NEW'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500 text-sm">No recent enquiries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section 2: Recent Blogs Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h6 className="text-[14px] font-semibold text-gray-700 uppercase tracking-wider m-0">Recent Blogs</h6>
          <Link to="/blogs/list" className="text-xs font-medium text-[#113C2B] hover:underline bg-[#113C2B]/10 px-2 py-1 rounded">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f3f6f9] text-gray-500 text-[13px] uppercase tracking-wider border-b border-gray-200">
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Author</th>
                <th className="px-5 py-3 font-semibold">Published Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBlogs.length > 0 ? (
                data.recentBlogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-800 font-medium max-w-[250px] truncate">{blog.title}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{blog.category || 'Uncategorized'}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{blog.author || 'Admin'}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{new Date(blog.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider ${
                        blog.status?.toLowerCase() === 'active' || blog.status?.toLowerCase() === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500 text-sm">No recent blogs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardView;
