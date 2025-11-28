'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface EventFiltersProps {
  institutions: string[];
  selectedInstitutions: string[];
  onSelectionChange: (institutions: string[]) => void;
}

export default function EventFilters({
  institutions,
  selectedInstitutions,
  onSelectionChange,
}: EventFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleInstitution = (institution: string) => {
    if (selectedInstitutions.includes(institution)) {
      onSelectionChange(selectedInstitutions.filter((i) => i !== institution));
    } else {
      onSelectionChange([...selectedInstitutions, institution]);
    }
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const selectAll = () => {
    onSelectionChange([...institutions]);
  };

  return (
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filter by Institution
          </h3>
        </div>

        <div className="flex gap-2">
          {selectedInstitutions.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
          {selectedInstitutions.length < institutions.length && (
            <button
              onClick={selectAll}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Select all
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {institutions.map((institution) => {
          const isSelected = selectedInstitutions.includes(institution);
          return (
            <button
              key={institution}
              onClick={() => toggleInstitution(institution)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
            >
              <span className="truncate">{institution}</span>
              {isSelected && (
                <X className="w-4 h-4 opacity-75 group-hover:opacity-100" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
  );
}

