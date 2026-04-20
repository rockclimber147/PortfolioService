import { type ReactNode } from 'react';

export interface Column<T> {
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface GenericTableProps<T> {
  items: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

export function GenericTable<T extends { id: string | number }>({ 
  items, 
  columns, 
  onRowClick 
}: GenericTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-gray-50 uppercase text-gray-700 font-semibold italic text-[10px] tracking-wider">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`px-6 py-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr 
              key={item.id} 
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col, i) => (
                <td key={i} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}