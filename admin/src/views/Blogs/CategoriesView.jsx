import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Edit, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateButton } from '../../components/ActionButtons';

export default function CategoriesView() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('Active');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch categories from Backend API
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error. Could not connect to API.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category Name is required');
      return;
    }
    
    const categoryData = { name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''), status };

    try {
      if (isEditing) {
        // Update existing
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData)
        });
        
        if (res.ok) {
          toast.success('Category updated successfully!');
          setIsEditing(false);
          setEditingId(null);
          fetchCategories();
        } else {
          toast.error('Failed to update category');
        }
      } else {
        // Add new
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData)
        });
        
        if (res.ok) {
          toast.success('Category added successfully!');
          fetchCategories();
        } else {
          toast.error('Failed to add category');
        }
      }
      
      // Reset form
      setName('');
      setSlug('');
      setStatus('Active');
    } catch (error) {
      toast.error('Server error');
    }
  };

  const handleEditClick = (category) => {
    setIsEditing(true);
    setEditingId(category._id);
    setName(category.name);
    setSlug(category.slug);
    setStatus(category.status);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for editing
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setSlug('');
    setStatus('Active');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Category deleted');
        setCategories(categories.filter(c => c._id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    // Update local state instantly for smooth UI
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCategories(items);
    
    // Send new order to backend
    const orderedIds = items.map(c => c._id);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/categories/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds })
      });
    } catch (error) {
      toast.error('Failed to save order on server');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Manage blog categories and their display order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              {isEditing ? (
                <><Edit size={18} className="text-[#113C2B]" /> Edit Category</>
              ) : (
                <><Plus size={18} className="text-[#113C2B]" /> Add New Category</>
              )}
            </h2>
            
            <form onSubmit={handleAddOrUpdateCategory} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#113C2B] focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Market Trends"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#113C2B] focus:border-transparent outline-none transition-all bg-gray-50"
                  placeholder="market-trends"
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#113C2B] focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full bg-[#0ab39c] hover:bg-[#099c88] text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isEditing ? <><Check size={18} /> Update Category</> : <><Plus size={18} /> Create Category</>}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">All Categories</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-[#113C2B] rounded-full border border-gray-200">
                  {categories.length} Total
                </span>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-lg border border-gray-100 p-3">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {categories.map((category, index) => (
                        <Draggable key={category._id} draggableId={category._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center justify-between p-4 rounded-lg border ${
                                snapshot.isDragging 
                                  ? 'bg-white border-[#113C2B] shadow-lg ring-1 ring-[#113C2B] z-50' 
                                  : (isEditing && editingId === category._id ? 'bg-green-50/50 border-[#113C2B] ring-1 ring-[#113C2B]' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm')
                              } transition-all`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-1 -ml-2"
                                >
                                  <GripVertical size={20} />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                                  <p className="text-sm text-gray-500">/{category.slug}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-5">
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ${
                                  category.status === 'Active' 
                                    ? 'bg-green-50 text-green-700 border border-green-200' 
                                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${category.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                  {category.status}
                                </span>

                                <div className="flex items-center gap-2 transition-opacity">
                                  <button 
                                    onClick={() => handleEditClick(category)}
                                    className="p-1.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50 transition-colors"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(category._id)}
                                    className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {categories.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No categories found. Add one to get started.
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-400 mt-5 flex items-center justify-center gap-1">
              <GripVertical size={12} /> Tip: Drag and drop categories to reorder them globally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
