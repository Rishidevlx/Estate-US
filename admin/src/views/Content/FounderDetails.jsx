import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';


const FounderDetails = () => {
  const [formData, setFormData] = useState({
    title: '',
    description1: '',
    description2: '',
    quote: '',
    image: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFounderDetails();
  }, []);

  const fetchFounderDetails = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/founder`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching founder details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: data
      });
      
      if (response.ok) {
        const responseData = await response.json();
        setFormData(prev => ({ ...prev, image: responseData.url }));
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/founder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Update failed');
      
      toast.success('Founder details updated successfully!');
    } catch (error) {
      console.error('Error saving founder details:', error);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#299cdb]"></div></div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Founder Details</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the "Our Founder" section on the homepage</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column - Image Upload */}
            <div className="md:col-span-1 space-y-4">
              <label className="block text-sm font-medium text-gray-700">Founder Image</label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                {formData.image ? (
                  <div className="relative">
                    <img src={formData.image} alt="Founder" className="w-full h-auto rounded-md" />
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity rounded-md cursor-pointer">
                      <span className="flex flex-col items-center gap-2 text-sm">
                        <ImageIcon size={20} /> Change Image
                      </span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-48">
                    <ImageIcon size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#299cdb]"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Recommended size: 600x700px. Max size: 2MB.</p>
            </div>
            
            {/* Right Column - Text Fields */}
            <div className="md:col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Real Estate, Made Simple"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#299cdb] focus:border-transparent outline-none transition-shadow"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph 1</label>
                <textarea
                  name="description1"
                  value={formData.description1}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#299cdb] focus:border-transparent outline-none transition-shadow resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph 2</label>
                <textarea
                  name="description2"
                  value={formData.description2}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#299cdb] focus:border-transparent outline-none transition-shadow resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted Quote / Statement</label>
                <input
                  type="text"
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  placeholder="e.g. Your goals. Our guidance. One step closer to home."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#299cdb] focus:border-transparent outline-none transition-shadow font-semibold"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-[#299cdb] hover:bg-[#258bbf] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-70"
            >
              {saving ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FounderDetails;
