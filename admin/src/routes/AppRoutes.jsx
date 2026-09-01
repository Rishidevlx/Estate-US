import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from '../views/Login/LoginView';
import AdminLayout from '../layouts/AdminLayout';
import DashboardView from '../views/Dashboard/DashboardView';
import CategoriesView from '../views/Blogs/CategoriesView';
import AddBlogView from '../views/Blogs/AddBlogView';
import ListBlogsView from '../views/Blogs/ListBlogsView';
import DraftBlogsView from '../views/Blogs/DraftBlogsView';
import BlogOverview from '../views/Blogs/BlogOverview';
import FounderDetails from '../views/Content/FounderDetails';

import ContactInfoView from '../views/Contacts/ContactInfoView';
import EnquiriesView from '../views/Contacts/EnquiriesView';
import ProfileView from '../views/Profile/ProfileView';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/blogs/categories" element={<CategoriesView />} />
          <Route path="/blogs/add" element={<AddBlogView />} />
          <Route path="/blogs/list" element={<ListBlogsView />} />
          <Route path="/blogs/drafts" element={<DraftBlogsView />} />
          <Route path="/blogs/view/:id" element={<BlogOverview />} />
          <Route path="/content/founder" element={<FounderDetails />} />
          <Route path="/contacts/info" element={<ContactInfoView />} />
          <Route path="/contacts/enquiries" element={<EnquiriesView />} />
          <Route path="/profile" element={<ProfileView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
