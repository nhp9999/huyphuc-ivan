import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  searchText?: string; // For custom search matching
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxResults?: number;
  className?: string;
  onClear?: () => void;
  allowClear?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn hoặc tìm kiếm...",
  disabled = false,
  loading = false,
  maxResults = 15,
  className = "",
  onClear,
  allowClear = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [displayValue, setDisplayValue] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      const selectedOption = options.find(opt => opt.value === value);
      setDisplayValue(selectedOption ? selectedOption.label : value);
    } else {
      setDisplayValue('');
    }
  }, [value, options]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      // Search logic is handled in filteredOptions
    }, 150),
    []
  );

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return options.slice(0, maxResults);
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = options.filter(option => {
      // Search by value (code)
      if (option.value.toLowerCase().includes(term)) {
        return true;
      }
      
      // Search by label (name)
      if (option.label.toLowerCase().includes(term)) {
        return true;
      }
      
      // Search by custom search text if provided
      if (option.searchText && option.searchText.toLowerCase().includes(term)) {
        return true;
      }
      
      return false;
    });

    // Sort by relevance: exact matches first, then partial matches
    filtered.sort((a, b) => {
      const aValueMatch = a.value.toLowerCase() === term;
      const bValueMatch = b.value.toLowerCase() === term;
      const aLabelMatch = a.label.toLowerCase() === term;
      const bLabelMatch = b.label.toLowerCase() === term;
      
      if (aValueMatch && !bValueMatch) return -1;
      if (bValueMatch && !aValueMatch) return 1;
      if (aLabelMatch && !bLabelMatch) return -1;
      if (bLabelMatch && !aLabelMatch) return 1;
      
      // Alphabetical sort for same relevance
      return a.label.localeCompare(b.label, 'vi');
    });

    return filtered.slice(0, maxResults);
  }, [options, searchTerm, maxResults]);

  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setDisplayValue(term);
    setIsOpen(true);
    setHighlightedIndex(-1);
    debouncedSearch(term);
  };

  // Handle option selection
  const handleOptionSelect = (option: DropdownOption) => {
    onChange(option.value);
    setDisplayValue(option.label);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setDisplayValue('');
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    onClear?.();
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
        
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        setSearchTerm('');
        if (value) {
          const selectedOption = options.find(opt => opt.value === value);
          setDisplayValue(selectedOption ? selectedOption.label : '');
        } else {
          setDisplayValue('');
        }
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        setSearchTerm('');
        if (value) {
          const selectedOption = options.find(opt => opt.value === value);
          setDisplayValue(selectedOption ? selectedOption.label : '');
        } else {
          setDisplayValue('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, options]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "Đang tải..." : placeholder}
          disabled={disabled || loading}
          className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        {/* Loading spinner */}
        {loading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Clear button */}
        {allowClear && value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Dropdown arrow */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg 
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown list */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            <>
              {searchTerm && (
                <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  {filteredOptions.length} kết quả{filteredOptions.length >= maxResults ? ` (hiển thị ${maxResults} đầu tiên)` : ''}
                </div>
              )}
              <ul ref={listRef} className="py-1">
                {filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                      index === highlightedIndex
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {option.value}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300"> - </span>
                    <span>{option.label.replace(new RegExp(`^${option.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*-\\s*`, 'i'), '')}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Không tìm thấy kết quả' : 'Không có dữ liệu'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default SearchableDropdown;
