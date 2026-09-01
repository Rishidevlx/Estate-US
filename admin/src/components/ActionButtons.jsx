import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const DeleteButton = ({ onClick, text = "Delete", className = "" }) => (
  <button 
    type="button"
    onClick={onClick}
    className={`px-4 py-2 text-[13px] font-medium text-white bg-[#f06548] rounded hover:bg-[#d6573e] transition-colors ${className}`}
  >
    {text}
  </button>
);

export const DraftButton = ({ onClick, text = "Draft", className = "" }) => (
  <button 
    type="button"
    onClick={onClick}
    className={`px-4 py-2 text-[13px] font-medium text-white bg-[#299cdb] rounded hover:bg-[#258bbf] transition-colors ${className}`}
  >
    {text}
  </button>
);

export const CreateButton = ({ onClick, text = "Create", className = "" }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 text-[13px] font-medium text-white bg-[#0ab39c] rounded hover:bg-[#099c88] transition-colors ${className}`}
  >
    {text}
  </button>
);

export const AddNewButton = ({ to, text = "Add New", className = "" }) => (
  <Link 
    to={to}
    className={`inline-flex items-center gap-1 px-4 py-2 text-[13px] font-medium text-white bg-[#0ab39c] rounded hover:bg-[#099c88] transition-colors ${className}`}
  >
    <Plus size={16} /> {text}
  </Link>
);
