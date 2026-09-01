import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, User, Lock, ExternalLink, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const ProfileView = () => {
  const [activeTab, setActiveTab] = useState('Personal Details');
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    profilePic: '',
    role: '',
    designation: ''
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Password State
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passMessage, setPassMessage] = useState({ text: '', type: '' });

  // General Settings State
  const [siteLogo, setSiteLogo] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoMessage, setLogoMessage] = useState({ text: '', type: '' });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSiteLogo(data.logo || '/sampras.png');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newProfileData = {
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            phone: data.data.phone || '',
            email: data.data.email || '',
            profilePic: data.data.profilePic || '',
            role: data.data.role || 'Admin',
            designation: data.data.designation || ''
          };
          setProfileData(newProfileData);
          
          // Also sync to local storage for Navbar on initial load
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...user, ...newProfileData }));
          window.dispatchEvent(new Event('userUpdated'));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fieldsToCheck = ['firstName', 'lastName', 'phone', 'email', 'profilePic', 'designation'];
  const filledCount = fieldsToCheck.filter(field => profileData[field] && profileData[field].trim() !== '').length;
  const progress = Math.round((filledCount / fieldsToCheck.length) * 100);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent typing invalid characters in phone number field
    if (name === 'phone') {
      const phoneRegex = /^[0-9+\-()\s]*$/;
      if (!phoneRegex.test(value)) {
        return; // ignore input if invalid
      }
    }
    
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setMessage({ text: 'Uploading image...', type: 'info' });
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData({ ...profileData, profilePic: data.url });
        setMessage({ text: 'Image uploaded successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to upload image.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error uploading image.', type: 'error' });
    }
    
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingLogo(true);
      setLogoMessage({ text: 'Uploading logo...', type: 'info' });
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const uploadResponse = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        const newLogoUrl = uploadData.url;
        
        // Save to settings
        const token = localStorage.getItem('token');
        const updateResponse = await fetch(`${apiUrl}/api/settings`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ publicInfo: { logo: newLogoUrl } })
        });
        
        if (updateResponse.ok) {
          setSiteLogo(newLogoUrl);
          setLogoMessage({ text: 'Logo updated successfully!', type: 'success' });
        } else {
          setLogoMessage({ text: 'Failed to save logo.', type: 'error' });
        }
      } else {
        setLogoMessage({ text: 'Failed to upload image.', type: 'error' });
      }
    } catch (error) {
      setLogoMessage({ text: 'Error uploading logo.', type: 'error' });
    } finally {
      setUploadingLogo(false);
      setTimeout(() => setLogoMessage({ text: '', type: '' }), 3000);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage({ text: '', type: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        // Update local storage so navbar reflects changes if needed
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...user, ...profileData }));
        window.dispatchEvent(new Event('userUpdated'));
        setIsEditing(false);
      } else {
        setMessage({ text: data.message || 'Failed to update profile.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Server error.', type: 'error' });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword.length < 6) {
      setPassMessage({ text: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    
    setSavingPassword(true);
    setPassMessage({ text: '', type: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/profile/change-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setPassMessage({ text: 'Password changed successfully!', type: 'success' });
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPassMessage({ text: data.message || 'Failed to change password.', type: 'error' });
      }
    } catch (error) {
      setPassMessage({ text: 'Server error.', type: 'error' });
    } finally {
      setSavingPassword(false);
      setTimeout(() => setPassMessage({ text: '', type: '' }), 3000);
    }
  };
  
  const triggerForgot = () => {
    // We can clear token and redirect to login, or just open a modal here.
    // Given the flow, it's easier to redirect to Login and trigger forgot password.
    localStorage.clear();
    window.location.href = '/?forgot=true';
  };

  if (loading) {
    return <div className="p-6 h-full flex justify-center items-center">Loading Profile...</div>;
  }

  return (
    <div className="p-6 bg-[#f3f3f9] min-h-screen">
      {/* Top Banner (Velzon Style) */}
      <div className="relative -mt-6 -mx-6 h-[260px] bg-[#405189] overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 -mt-[140px] relative z-0">
        
        {/* Left Column: Profile Card */}
        <div className="w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 flex flex-col items-center">
              
              <div className="relative group mb-4">
                <div className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  {profileData.profilePic ? (
                    <img src={profileData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
                
                {/* Upload Button Overlay */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#405189] transition-colors"
                >
                  <Camera size={18} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <h4 className="text-[22px] font-semibold text-gray-800 tracking-tight">
                {profileData.firstName} {profileData.lastName}
              </h4>
              <p className="text-[13px] text-gray-500 font-medium uppercase tracking-wider mt-1 mb-4">
                {profileData.designation || profileData.role}
              </p>

            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100 bg-[#f3f6f9]">
              <h6 className="text-[13px] font-semibold text-gray-700 uppercase tracking-wide m-0">Complete Your Profile</h6>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-gray-600 font-semibold">Setup Progress</span>
                <span className="text-[12px] bg-[#405189] text-white px-2 py-0.5 rounded font-medium">{progress}%</span>
              </div>
              <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs and Forms */}
        <div className="flex-1">
          <div className="bg-white rounded-md shadow-sm border border-gray-100 min-h-[500px]">
            
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 bg-white px-2 pt-2">
              <button 
                onClick={() => setActiveTab('Personal Details')}
                className={`px-4 py-3 text-[14px] font-medium transition-all border-b-2 -mb-px ${activeTab === 'Personal Details' ? 'text-[#405189] border-[#405189]' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
              >
                Personal Details
              </button>
              <button 
                onClick={() => setActiveTab('General Settings')}
                className={`px-4 py-3 text-[14px] font-medium transition-all border-b-2 -mb-px ${activeTab === 'General Settings' ? 'text-[#405189] border-[#405189]' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
              >
                General Settings
              </button>
            </div>

            <div className="p-6">
              {/* Tab Content: Personal Details */}
              {activeTab === 'Personal Details' && (
                <form onSubmit={saveProfile}>
                  {message.text && (
                    <div className={`mb-4 p-3 rounded-md flex items-center gap-2 text-[13px] font-medium ${message.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : message.type === 'info' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      <CheckCircle size={16} />
                      {message.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white focus:border-[#405189] focus:ring-1 focus:ring-[#405189]'}`}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white focus:border-[#405189] focus:ring-1 focus:ring-[#405189]'}`}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone Number</label>
                      <input 
                        type="text" 
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white focus:border-[#405189] focus:ring-1 focus:ring-[#405189]'}`}
                        placeholder="+(1) 987 6543"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white focus:border-[#405189] focus:ring-1 focus:ring-[#405189]'}`}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Designation</label>
                      <input 
                        type="text" 
                        name="designation"
                        value={profileData.designation}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 outline-none transition-all ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white focus:border-[#405189] focus:ring-1 focus:ring-[#405189]'}`}
                        placeholder="e.g. Lead Designer / Developer"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    {!isEditing ? (
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(true)}
                        className="bg-[#405189] hover:bg-[#364574] text-white text-[13px] font-semibold px-4 py-2 rounded-md transition-colors shadow-sm"
                      >
                        Edit Details
                      </button>
                    ) : (
                      <>
                        <button 
                          type="button" 
                          onClick={() => { setIsEditing(false); fetchProfile(); }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-semibold px-4 py-2 rounded-md transition-colors shadow-sm"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          disabled={savingProfile}
                          className="bg-[#0ab39c] hover:bg-[#099885] text-white text-[13px] font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
                        >
                          {savingProfile ? 'Saving...' : 'Save Details'}
                        </button>
                      </>
                    )}
                  </div>
                </form>
              )}

              {/* Tab Content: General Settings */}
              {activeTab === 'General Settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Change Password */}
                  <div>
                    <h5 className="text-[15px] font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Change Password</h5>
                    <form onSubmit={changePassword}>
                      {passMessage.text && (
                        <div className={`mb-4 p-3 rounded-md flex items-center gap-2 text-[13px] font-medium ${passMessage.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                          <CheckCircle size={16} />
                          {passMessage.text}
                        </div>
                      )}

                      <div className="flex flex-col gap-5 mb-2">
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Old Password*</label>
                          <input 
                            type="password" 
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handlePasswordChange}
                            className="w-full bg-white border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 outline-none focus:border-[#405189] focus:ring-1 focus:ring-[#405189] transition-all"
                            placeholder="Enter current password"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">New Password*</label>
                          <input 
                            type="password" 
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full bg-white border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 outline-none focus:border-[#405189] focus:ring-1 focus:ring-[#405189] transition-all"
                            placeholder="Enter new password"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Confirm Password*</label>
                          <input 
                            type="password" 
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full bg-white border border-gray-200 text-gray-700 text-[13px] rounded-md px-3 py-2.5 outline-none focus:border-[#405189] focus:ring-1 focus:ring-[#405189] transition-all"
                            placeholder="Confirm password"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mb-5 mt-3 flex justify-end">
                        <button 
                          type="button" 
                          onClick={triggerForgot}
                          className="text-[13px] text-[#405189] hover:underline font-medium"
                        >
                          Forgot Password ?
                        </button>
                      </div>

                      <div className="flex justify-start">
                        <button 
                          type="submit" 
                          disabled={savingPassword}
                          className="w-full bg-[#0ab39c] hover:bg-[#099885] text-white text-[13px] font-semibold px-4 py-2 rounded-md transition-colors shadow-sm disabled:opacity-70"
                        >
                          {savingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Right Column: Site Logo */}
                  <div>
                    <h5 className="text-[15px] font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Site Logo (Dynamic)</h5>
                    <p className="text-[13px] text-gray-500 mb-4">This logo will be dynamically rendered on the frontend Navbar, Footer, and Favicon.</p>
                    
                    {logoMessage.text && (
                      <div className={`mb-4 p-3 rounded-md flex items-center gap-2 text-[13px] font-medium ${logoMessage.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : logoMessage.type === 'info' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        <CheckCircle size={16} />
                        {logoMessage.text}
                      </div>
                    )}
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 relative group">
                      {siteLogo ? (
                        <div className="w-full h-32 flex items-center justify-center p-2 bg-white rounded shadow-sm border border-gray-200">
                          <img src={siteLogo} alt="Site Logo" className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400">
                          <Camera size={32} className="mb-2" />
                          <span className="text-[13px]">No Logo Uploaded</span>
                        </div>
                      )}
                      
                      <label className="mt-4 cursor-pointer">
                        <span className="bg-[#405189] hover:bg-[#364574] text-white text-[13px] font-semibold px-4 py-2 rounded-md transition-colors shadow-sm inline-block">
                          {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                        </span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
