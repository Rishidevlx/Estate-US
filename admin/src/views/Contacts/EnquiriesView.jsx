import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const EnquiriesView = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Status mapping for badges
  const statusColors = {
    'New': 'bg-emerald-100 text-emerald-600',
    'Inprogress': 'bg-amber-100 text-amber-600',
    'On-Hold': 'bg-indigo-100 text-indigo-600',
    'Closed': 'bg-rose-100 text-rose-600'
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact/enquiries`);
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        // Update local state without fetching everything again
        setEnquiries(enquiries.map(enq => enq._id === id ? { ...enq, status: newStatus } : enq));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Filtered and paginated data
  const filteredEnquiries = enquiries.filter(enq => 
    enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enq.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEnquiries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEnquiries.length / entriesPerPage);

  // Formatting date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="p-6 h-full flex flex-col bg-[#f3f3f9]">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 uppercase tracking-wide">Enquiries</h1>
        <div className="text-sm text-gray-500 mt-1">Contacts / Enquiries</div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 font-medium">Show</span>
            <select 
              className="border border-gray-200 text-gray-600 text-[13px] rounded-md px-2 py-1.5 outline-none focus:border-[#878a99]"
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-[13px] text-gray-500 font-medium">entries</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500 font-medium">Search:</span>
            <div className="relative">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 text-[13px] rounded-md px-3 py-1.5 w-[200px] outline-none focus:border-[#878a99]"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#f3f6f9] text-gray-500 text-[13px] font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="px-4 py-3 cursor-pointer select-none">SR No.</th>
                <th className="px-4 py-3 cursor-pointer select-none">Name</th>
                <th className="px-4 py-3 cursor-pointer select-none">Email</th>
                <th className="px-4 py-3 cursor-pointer select-none">Phone</th>
                <th className="px-4 py-3 cursor-pointer select-none">Subject</th>
                <th className="px-4 py-3 cursor-pointer select-none">Create Date</th>
                <th className="px-4 py-3 cursor-pointer select-none">Status</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-gray-600">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Loading enquiries...</td></tr>
              ) : currentEntries.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-400">No enquiries found</td></tr>
              ) : (
                currentEntries.map((enq, index) => (
                  <tr key={enq._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{String(indexOfFirstEntry + index + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-3 text-[#405189] font-medium">{enq.name}</td>
                    <td className="px-4 py-3">{enq.email}</td>
                    <td className="px-4 py-3">{enq.phone || '-'}</td>
                    <td className="px-4 py-3">{enq.subject || '-'}</td>
                    <td className="px-4 py-3">{formatDate(enq.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block w-full">
                        <select 
                          className={`appearance-none text-[11px] font-semibold px-2.5 py-1 rounded-[4px] border-none outline-none cursor-pointer w-full uppercase tracking-wide ${statusColors[enq.status] || 'bg-gray-100 text-gray-600'}`}
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        >
                          <option value="New" className="bg-white text-gray-700">New</option>
                          <option value="Inprogress" className="bg-white text-gray-700">Inprogress</option>
                          <option value="On-Hold" className="bg-white text-gray-700">On-Hold</option>
                          <option value="Closed" className="bg-white text-gray-700">Closed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1">
                          <ChevronDown size={12} className={statusColors[enq.status] ? 'opacity-70' : 'text-gray-400'} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white">
          <div className="text-[13px] text-gray-500">
            Showing {filteredEnquiries.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, filteredEnquiries.length)} of {filteredEnquiries.length} entries
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-[13px] border border-gray-200 rounded-l-md ${currentPage === 1 ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-[13px] border-t border-b border-r border-gray-200 ${currentPage === i + 1 ? 'bg-[#405189] text-white border-[#405189]' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1.5 text-[13px] border-t border-b border-r border-gray-200 rounded-r-md ${currentPage === totalPages || totalPages === 0 ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesView;
