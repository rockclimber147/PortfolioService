import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService } from '@portfolio/shared';

interface ThumbnailUploadProps {
  value?: string;
  onChange: (url: string) => void;
  labelClass: string;
}

export const ThumbnailUpload = ({ value, onChange, labelClass }: ThumbnailUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { apiKey } = useAuth();
  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !adminApi) return; // Pass adminApi as a prop

    try {
      setIsUploading(true);
      const url = await adminApi.uploadImage(file);
      onChange(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className={labelClass}>Project Thumbnail</label>
      
      <div className="relative group border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors bg-gray-50">
        {value ? (
          <div className="relative aspect-video">
            <img 
              src={value} 
              alt="Thumbnail preview" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-10 cursor-pointer">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <span className="text-2xl mb-2">📸</span>
                <span className="text-xs font-medium text-gray-400">Upload Image</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
};