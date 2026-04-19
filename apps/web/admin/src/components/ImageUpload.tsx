import React, { useState } from 'react';

// apps/web/admin/src/components/ImageUpload.tsx

interface ImageUploadProps {
  value?: string;
  onFileSelect: (file: File | null) => void;
  onClearExisting?: () => void;
  labelClass: string;
  label?: string;      // "Project Thumbnail" vs "Profile Photo"
  aspect?: string;     // "aspect-video" vs "aspect-square"
  isCircular?: boolean; // Rounded corners vs full circle
}

export const ImageUpload = ({ 
  value, 
  onFileSelect, 
  onClearExisting, 
  labelClass,
  label = "Upload Image",
  aspect = "aspect-video",
  isCircular = false
}: ImageUploadProps) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (localPreview) URL.revokeObjectURL(localPreview);
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onClearExisting) onClearExisting();
  };

  const displayUrl = localPreview || value;

  return (
    <div className="space-y-4">
      <label className={labelClass}>{label}</label>
      <div className={`relative group border-2 border-dashed border-gray-200 overflow-hidden hover:border-blue-400 transition-colors bg-gray-50 flex items-center justify-center
        ${isCircular ? 'rounded-full w-40 h-40 mx-auto' : 'rounded-xl w-full'}`}
      >
        {displayUrl ? (
          <div className={`relative w-full ${isCircular ? 'h-full' : aspect}`}>
            <img src={displayUrl} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={handleClear} 
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-20"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-10 cursor-pointer w-full h-full">
            <span className="text-2xl mb-2">📸</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center px-2">Select {label}</span>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </label>
        )}
      </div>
    </div>
  );
};