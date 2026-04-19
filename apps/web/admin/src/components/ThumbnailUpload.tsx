import React, { useState } from 'react';

interface ThumbnailUploadProps {
  value?: string;
  onFileSelect: (file: File | null) => void;
  onClearExisting?: () => void; // New prop to clear the DB value in parent
  labelClass: string;
}

export const ThumbnailUpload = ({ value, onFileSelect, onClearExisting, labelClass }: ThumbnailUploadProps) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous local preview memory
      if (localPreview) URL.revokeObjectURL(localPreview);
      
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    // 1. Clear local states
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    onFileSelect(null);

    // 2. Clear the actual file input so it can trigger onChange again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // 3. Tell parent to wipe the existing DB thumbnail URL if it exists
    if (onClearExisting) {
      onClearExisting();
    }
  };

  const displayUrl = localPreview || value;

  return (
    <div className="space-y-4">
      <label className={labelClass}>Project Thumbnail</label>
      <div className="relative group border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors bg-gray-50 min-h-[150px] flex items-center justify-center">
        {displayUrl ? (
          <div className="relative w-full aspect-video">
            <img src={displayUrl} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={handleClear} 
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-10 cursor-pointer w-full h-full">
            <span className="text-2xl mb-2">📸</span>
            <span className="text-xs font-medium text-gray-400">Select Image</span>
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