// apps/web/admin/components/TagSelector.tsx
import { useEffect, useState } from 'react';
import { AdminApiService, type TagRead } from '@portfolio/shared';

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (newTagIds: string[]) => void;
  adminApi: AdminApiService;
}

export const TagSelector = ({ selectedTagIds, onChange, adminApi }: TagSelectorProps) => {
  const [availableTags, setAvailableTags] = useState<TagRead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listTags()
      .then(setAvailableTags)
      .finally(() => setLoading(false));
  }, [adminApi]);

  const toggleTag = (tagId: string) => {
    const isSelected = selectedTagIds.includes(tagId);
    if (isSelected) {
      onChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  if (loading) return <div className="text-xs text-gray-400 italic">Loading tags...</div>;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {availableTags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button" // Critical to prevent form submission
            onClick={() => toggleTag(tag.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              isSelected
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:border-blue-400'
            }`}
          >
            {isSelected && <span className="mr-1">✓</span>}
            {tag.name}
          </button>
        );
      })}
      {availableTags.length === 0 && (
        <p className="text-xs text-gray-400 italic">No tags found.</p>
      )}
    </div>
  );
};