import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, Edit2, Phone, Mail, MapPin, Globe, Key, User, Send, Server, Navigation, AlertCircle, Loader } from 'lucide-react';

const FacebookIcon = () => <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>;
const TwitterIcon = () => <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>;
const InstagramIcon = () => <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const LinkedinIcon = () => <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;

export default function ContactInfoView() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for Public Info
  const [publicInfo, setPublicInfo] = useState({
    phone: '',
    email: '',
    address: '',
    mapLocation: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });

  // State for Mail Config
  const [mailConfig, setMailConfig] = useState({
    recipientEmail: '',
    serviceProvider: 'Nodemailer', // Nodemailer or CustomMail
    senderAccount: '',
    appPassword: ''
  });

  // State for Validation Errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setPublicInfo({
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          mapLocation: data.mapLocation || '',
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          instagram: data.instagram || '',
          linkedin: data.linkedin || ''
        });
        if (data.mailConfig) {
          setMailConfig({
            recipientEmail: data.mailConfig.recipientEmail || '',
            serviceProvider: data.mailConfig.serviceProvider || 'Nodemailer',
            senderAccount: data.mailConfig.senderAccount || '',
            appPassword: data.mailConfig.appPassword || ''
          });
        }
      }
    } catch (error) {
      toast.error('Failed to load settings from server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublicChange = (e) => {
    if (!isEditing) return;
    setPublicInfo({ ...publicInfo, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleMailChange = (e) => {
    if (!isEditing) return;
    setMailConfig({ ...mailConfig, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!publicInfo.phone) newErrors.phone = 'Phone number is required';
    if (!publicInfo.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(publicInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!publicInfo.address) newErrors.address = 'Physical address is required';

    if (!mailConfig.recipientEmail) {
      newErrors.recipientEmail = 'Recipient email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(mailConfig.recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email address';
    }
    if (!mailConfig.senderAccount) newErrors.senderAccount = 'Sender account is required';
    if (!mailConfig.appPassword) newErrors.appPassword = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (validateForm()) {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicInfo, mailConfig })
        });
        
        if (res.ok) {
          toast.success('Configurations saved successfully!');
          setIsEditing(false);
        } else {
          toast.error('Failed to save settings.');
        }
      } catch (error) {
        toast.error('Error connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please fix the validation errors before submitting.');
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div className="p-6 font-sans bg-[#f3f6f9] min-h-screen flex justify-center items-center">
        <Loader className="animate-spin text-[#0ab39c]" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 font-sans bg-[#f3f6f9] min-h-screen">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[15px] font-medium text-gray-700 uppercase tracking-wide">Contact Information</h4>
        <div className="text-[13px] text-gray-500">
          <span>Settings</span> <span className="mx-1">/</span> <span className="text-gray-400">Contact Info</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Left Column: Public Contact Info */}
          <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e9ebec]">
              <h5 className="text-[15px] font-semibold text-[#495057] flex items-center gap-2">
                <Globe size={18} className="text-[#0ab39c]" />
                Public Contact Details
              </h5>
              <p className="text-[13px] text-gray-500 mt-1">This information is displayed publicly on the website (Navbar, Footer, Contact Page).</p>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#495057] mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={15} className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="phone"
                      value={publicInfo.phone}
                      onChange={handlePublicChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 text-[13px] border rounded-[0.25rem] outline-none transition-colors ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${errors.phone ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-[#ced4da] focus:border-[#878a99]'}`}
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#495057] mb-2">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={15} className="text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={publicInfo.email}
                      onChange={handlePublicChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 text-[13px] border rounded-[0.25rem] outline-none transition-colors ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${errors.email ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-[#ced4da] focus:border-[#878a99]'}`}
                      placeholder="contact@company.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#495057] mb-2">Physical Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <MapPin size={15} className="text-gray-400" />
                  </div>
                  <textarea 
                    name="address"
                    value={publicInfo.address}
                    onChange={handlePublicChange}
                    disabled={!isEditing}
                    rows="3"
                    className={`w-full pl-10 pr-3 py-2 text-[13px] border rounded-[0.25rem] outline-none transition-colors ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${errors.address ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-[#ced4da] focus:border-[#878a99]'}`}
                    placeholder="Enter full address..."
                  ></textarea>
                </div>
                {errors.address && <p className="text-red-500 text-[11px] mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#495057] mb-2">Google Map Location (Embed URL)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Navigation size={15} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    name="mapLocation"
                    value={publicInfo.mapLocation}
                    onChange={handlePublicChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-3 py-2 text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Used to display the map on the Contact Us page.</p>
              </div>

              <div className="border-t border-dashed border-[#e9ebec] pt-5">
                <h6 className="text-[13px] font-semibold text-[#495057] mb-4">Social Media Links</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1877F2]">
                      <FacebookIcon />
                    </div>
                    <input 
                      type="text" 
                      name="facebook"
                      value={publicInfo.facebook}
                      onChange={handlePublicChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-1.5 text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                      placeholder="Facebook URL"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1DA1F2]">
                      <TwitterIcon />
                    </div>
                    <input 
                      type="text" 
                      name="twitter"
                      value={publicInfo.twitter}
                      onChange={handlePublicChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-1.5 text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                      placeholder="Twitter URL"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#E4405F]">
                      <InstagramIcon />
                    </div>
                    <input 
                      type="text" 
                      name="instagram"
                      value={publicInfo.instagram}
                      onChange={handlePublicChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-1.5 text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                      placeholder="Instagram URL"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0A66C2]">
                      <LinkedinIcon />
                    </div>
                    <input 
                      type="text" 
                      name="linkedin"
                      value={publicInfo.linkedin}
                      onChange={handlePublicChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-1.5 text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Mail Configuration */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-[0_1px_2px_rgba(56,65,74,0.15)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#e9ebec]">
                <h5 className="text-[15px] font-semibold text-[#495057] flex items-center gap-2">
                  <Server size={18} className="text-[#f06548]" />
                  Backend Mail Configuration
                </h5>
                <p className="text-[13px] text-gray-500 mt-1">Configure where contact form submissions are sent and how they are authenticated.</p>
              </div>
              
              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#495057] mb-2">Recipient Email (Leads sent here) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Send size={15} className="text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      name="recipientEmail"
                      value={mailConfig.recipientEmail}
                      onChange={handleMailChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 text-[13px] border rounded-[0.25rem] outline-none transition-colors ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${errors.recipientEmail ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-[#ced4da] focus:border-[#878a99]'}`}
                      placeholder="leads@company.com"
                    />
                  </div>
                  {errors.recipientEmail && <p className="text-red-500 text-[11px] mt-1">{errors.recipientEmail}</p>}
                  <p className="text-[11px] text-gray-500 mt-1">When users submit the contact form, emails will be delivered to this address.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-dashed border-[#e9ebec] pt-5">
                  <div>
                    <label className="block text-[13px] font-medium text-[#495057] mb-2">Mail Service Provider</label>
                    <select 
                      name="serviceProvider"
                      value={mailConfig.serviceProvider}
                      onChange={handleMailChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 text-[13px] border border-[#ced4da] rounded-[0.25rem] focus:border-[#878a99] outline-none ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                    >
                      <option value="Nodemailer">Nodemailer (App Password)</option>
                      <option value="CustomMail">Custom Mail (Zoho SMTP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#495057] mb-2">Sender Account <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={15} className="text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        name="senderAccount"
                        value={mailConfig.senderAccount}
                        onChange={handleMailChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-3 py-2 text-[13px] border rounded-[0.25rem] outline-none transition-colors ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${errors.senderAccount ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-[#ced4da] focus:border-[#878a99]'}`}
                        placeholder="noreply@company.com"
                      />
                    </div>
                    {errors.senderAccount && <p className="text-red-500 text-[11px] mt-1">{errors.senderAccount}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#495057] mb-2">
                    {mailConfig.serviceProvider === 'Nodemailer' ? 'App Password' : 'Password'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key size={15} className="text-gray-400" />
                    </div>
                    <input 
                      type={isEditing ? "text" : "password"} 
                      name="appPassword"
                      value={mailConfig.appPassword}
                      onChange={handleMailChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 text-[13px] border rounded-[0.25rem] outline-none transition-colors ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${errors.appPassword ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-[#ced4da] focus:border-[#878a99]'}`}
                      placeholder={mailConfig.serviceProvider === 'Nodemailer' ? "Enter App Password..." : "Enter Account Password..."}
                    />
                  </div>
                  {errors.appPassword && <p className="text-red-500 text-[11px] mt-1">{errors.appPassword}</p>}
                  <p className="text-[11px] text-[#0ab39c] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> This is securely encrypted before saving to the database.
                  </p>
                </div>
              </div>
            </div>

            {/* Save/Edit Action */}
            <div className="bg-white rounded-[0.25rem] border border-[#e9ebec] shadow-sm p-4 flex justify-between items-center mt-auto">
              <p className="text-[13px] text-gray-500">
                {isEditing ? 'Ensure all validations pass before saving.' : 'Click edit to modify these configurations.'}
              </p>
              <button 
                type="submit"
                disabled={isLoading}
                className={`flex items-center gap-2 px-5 py-2 rounded-[0.25rem] text-[13px] font-medium transition-colors shadow-sm ${
                  isEditing 
                    ? 'bg-[#0ab39c] text-white hover:bg-[#099885]' 
                    : 'bg-[#405189] text-white hover:bg-[#334273]'
                }`}
              >
                {isLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : isEditing ? (
                  <><Save size={16} /> Save Configurations</>
                ) : (
                  <><Edit2 size={16} /> Edit Settings</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Live Preview Section */}
      <div className="mt-8 flex flex-col gap-6 max-w-5xl">
        <h5 className="text-[15px] font-semibold text-[#495057] mb-2 flex items-center gap-2">
          Frontend Live Preview
        </h5>
        
        {/* Navbar Snippet Preview */}
        <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#113C2B] text-white px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Phone size={14} />
                <span className="text-[13px] font-medium tracking-wide">{publicInfo.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Mail size={14} />
                <span className="text-[13px] font-medium tracking-wide">{publicInfo.email || 'N/A'}</span>
              </div>
            </div>
            <div className="flex gap-4 text-white/80 text-[13px] uppercase font-semibold tracking-wider">
              <span>Home</span>
              <span>About</span>
              <span>Services</span>
              <span>Blog</span>
              <span>Contact</span>
            </div>
          </div>
        </div>

        {/* Contact Form Details Preview */}
        <div className="bg-white rounded shadow-sm border border-gray-100 p-8 flex gap-10">
          <div className="flex-1">
            <h2 className="text-[#0e2e22] text-2xl font-serif mb-6">Sampras Realty Group Office</h2>
            <div className="flex items-start gap-4 mb-4">
              <p className="text-[15px] text-[#4a4a4a] whitespace-pre-line leading-relaxed">
                {publicInfo.address || 'Address goes here'}
              </p>
            </div>
            
            <div className="flex items-center gap-4 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#fdfaf2] flex items-center justify-center text-[#d4af37]">
                <Phone size={14} />
              </div>
              <span className="text-[#1a1a1a] font-medium text-[15px]">{publicInfo.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-[#fdfaf2] flex items-center justify-center text-[#d4af37]">
                <Mail size={14} />
              </div>
              <span className="text-[#d4af37] font-medium text-[15px]">{publicInfo.email || 'N/A'}</span>
            </div>
            
            <div className="flex gap-3">
              {publicInfo.facebook && <a href={publicInfo.facebook} className="w-10 h-10 rounded bg-[#333333] hover:bg-[#d4af37] flex items-center justify-center text-white transition-colors"><FacebookIcon /></a>}
              {publicInfo.twitter && <a href={publicInfo.twitter} className="w-10 h-10 rounded bg-[#333333] hover:bg-[#d4af37] flex items-center justify-center text-white transition-colors"><TwitterIcon /></a>}
              {publicInfo.linkedin && <a href={publicInfo.linkedin} className="w-10 h-10 rounded bg-[#333333] hover:bg-[#d4af37] flex items-center justify-center text-white transition-colors"><LinkedinIcon /></a>}
            </div>
          </div>
          
          <div className="flex-1 bg-[#f9f9f9] border border-gray-200 rounded relative overflow-hidden min-h-[300px] flex items-center justify-center">
            {publicInfo.mapLocation ? (
              <iframe src={publicInfo.mapLocation} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
            ) : (
              <span className="text-[13px] text-gray-500">Map will be displayed here</span>
            )}
          </div>
        </div>

        {/* Footer Preview */}
        <div className="bg-[#0b1f16] rounded shadow-sm overflow-hidden text-white pt-10 pb-6 px-10">
          <div className="grid grid-cols-3 gap-10 border-b border-white/10 pb-8 mb-6">
            <div>
              <h3 className="text-[#d4af37] font-medium mb-4">Let's Talk Real Estate</h3>
              <p className="text-sm text-gray-400 leading-relaxed">We are here to answer your questions, discuss your goals, and help you take the next step in your real estate journey.</p>
            </div>
            <div>
              <h3 className="text-[#d4af37] font-medium mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>Home</li>
                <li>About Us</li>
                <li>Our Services</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#d4af37] font-medium mb-4">Contact Us</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3"><MapPin size={16} className="text-[#d4af37]" /> <span className="whitespace-pre-line">{publicInfo.address || 'N/A'}</span></li>
                <li className="flex gap-3"><Mail size={16} className="text-[#d4af37]" /> {publicInfo.email || 'N/A'}</li>
                <li className="flex gap-3"><Phone size={16} className="text-[#d4af37]" /> {publicInfo.phone || 'N/A'}</li>
                <li className="flex gap-3"><Globe size={16} className="text-[#d4af37]" /> www.samprasrealtygroup.com</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <p>© 2026 Sampras Realty Group. All Rights Reserved.</p>
            <p>Developed by <span className="text-[#d4af37]">Lykspire</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
