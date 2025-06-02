import { useState, useEffect, useCallback } from 'react';

export interface CellPosition {
  row: number;
  col: number;
}

export interface ExcelTableHookProps {
  data: any[];
  onDataChange: (rowIndex: number, field: string, value: string) => void;
  columns: string[];
}

export const useExcelTable = ({ data, onDataChange, columns }: ExcelTableHookProps) => {
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [selectedRange, setSelectedRange] = useState<{start: CellPosition, end: CellPosition} | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [copiedData, setCopiedData] = useState<string[][] | null>(null);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (row > 0) {
          setSelectedCell({ row: row - 1, col });
        }
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        if (row < data.length - 1) {
          setSelectedCell({ row: row + 1, col });
        }
        break;
      
      case 'ArrowLeft':
        e.preventDefault();
        if (col > 0) {
          setSelectedCell({ row, col: col - 1 });
        }
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        if (col < columns.length - 1) {
          setSelectedCell({ row, col: col + 1 });
        }
        break;
      
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+Tab: Move left
          if (col > 0) {
            setSelectedCell({ row, col: col - 1 });
          } else if (row > 0) {
            setSelectedCell({ row: row - 1, col: columns.length - 1 });
          }
        } else {
          // Tab: Move right
          if (col < columns.length - 1) {
            setSelectedCell({ row, col: col + 1 });
          } else if (row < data.length - 1) {
            setSelectedCell({ row: row + 1, col: 0 });
          }
        }
        break;
      
      case 'Enter':
        e.preventDefault();
        if (row < data.length - 1) {
          setSelectedCell({ row: row + 1, col });
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setSelectedCell(null);
        setSelectedRange(null);
        break;
      
      case 'c':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handleCopy();
        }
        break;
      
      case 'v':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handlePaste();
        }
        break;
      
      case 'a':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handleSelectAll();
        }
        break;
    }
  }, [selectedCell, data.length, columns.length]);

  // Helper function to get display value for different field types
  const getDisplayValue = useCallback((rowData: any, field: string) => {
    const value = rowData?.[field] || '';

    // Handle special fields that need display text instead of raw value
    switch (field) {
      case 'gioiTinh':
        return value; // Nam/Nữ already display text

      case 'tinhKCB':
        // Could map province code to name if needed
        return value;

      case 'maBenhVien':
        // Use tenBenhVien for display if available
        return rowData?.tenBenhVien || value;

      case 'sttHo':
        return value === '5+' ? '5+' : value;

      case 'soThangDong':
        return value ? `${value} tháng` : '';

      case 'soTienDong':
        // Format currency if it's a number
        if (value && !isNaN(value)) {
          return new Intl.NumberFormat('vi-VN').format(Number(value));
        }
        return value;

      default:
        return String(value);
    }
  }, []);

  // Copy selected data
  const handleCopy = useCallback(() => {
    if (!selectedCell && !selectedRange) return;

    let dataToCopy: string[][];

    if (selectedRange) {
      // Copy range
      const { start, end } = selectedRange;
      const startRow = Math.min(start.row, end.row);
      const endRow = Math.max(start.row, end.row);
      const startCol = Math.min(start.col, end.col);
      const endCol = Math.max(start.col, end.col);

      dataToCopy = [];
      for (let row = startRow; row <= endRow; row++) {
        const rowData: string[] = [];
        for (let col = startCol; col <= endCol; col++) {
          const field = columns[col];
          const displayValue = getDisplayValue(data[row], field);
          rowData.push(displayValue);
        }
        dataToCopy.push(rowData);
      }
    } else if (selectedCell) {
      // Copy single cell
      const field = columns[selectedCell.col];
      const displayValue = getDisplayValue(data[selectedCell.row], field);
      dataToCopy = [[displayValue]];
    } else {
      return;
    }

    setCopiedData(dataToCopy);

    // Copy to clipboard
    const textToCopy = dataToCopy.map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Data copied to clipboard:', textToCopy);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  }, [selectedCell, selectedRange, data, columns, getDisplayValue]);

  // Helper function to process pasted value for different field types
  const processPastedValue = useCallback((field: string, value: string) => {
    const trimmedValue = value.trim();

    switch (field) {
      case 'gioiTinh':
        // Normalize gender values
        const lowerValue = trimmedValue.toLowerCase();
        if (lowerValue.includes('nam') || lowerValue === 'm' || lowerValue === 'male') {
          return 'Nam';
        } else if (lowerValue.includes('nữ') || lowerValue.includes('nu') || lowerValue === 'f' || lowerValue === 'female') {
          return 'Nữ';
        }
        return trimmedValue;

      case 'sttHo':
        // Handle household order
        if (trimmedValue === '5+' || parseInt(trimmedValue) >= 5) {
          return '5+';
        } else if (['1', '2', '3', '4'].includes(trimmedValue)) {
          return trimmedValue;
        }
        return '';

      case 'soThangDong':
        // Extract number from text like "12 tháng" or just "12"
        const monthMatch = trimmedValue.match(/(\d+)/);
        if (monthMatch) {
          const months = parseInt(monthMatch[1]);
          if ([3, 6, 12].includes(months)) {
            return months.toString();
          }
        }
        return '';

      case 'soTienDong':
        // Remove currency formatting and extract number
        const cleanNumber = trimmedValue.replace(/[^\d]/g, '');
        return cleanNumber || '';

      case 'ngaySinh':
        // Try to parse date in various formats
        if (trimmedValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return trimmedValue; // Already in YYYY-MM-DD format
        } else if (trimmedValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          // Convert DD/MM/YYYY to YYYY-MM-DD
          const [day, month, year] = trimmedValue.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (trimmedValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
          // Convert D/M/YYYY to YYYY-MM-DD
          const [day, month, year] = trimmedValue.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return trimmedValue;

      default:
        return trimmedValue;
    }
  }, []);

  // Paste data
  const handlePaste = useCallback(async () => {
    if (!selectedCell) return;

    try {
      const clipboardText = await navigator.clipboard.readText();
      const rows = clipboardText.split('\n').filter(row => row.trim());
      const pasteData = rows.map(row => row.split('\t'));

      // Paste starting from selected cell
      const startRow = selectedCell.row;
      const startCol = selectedCell.col;

      pasteData.forEach((rowData, rowOffset) => {
        const targetRow = startRow + rowOffset;
        if (targetRow >= data.length) return; // Don't paste beyond data bounds

        rowData.forEach((cellValue, colOffset) => {
          const targetCol = startCol + colOffset;
          if (targetCol >= columns.length) return; // Don't paste beyond columns

          const field = columns[targetCol];
          const processedValue = processPastedValue(field, cellValue);
          onDataChange(targetRow, field, processedValue);
        });
      });

      console.log('Data pasted successfully');
    } catch (err) {
      console.error('Failed to paste from clipboard:', err);
    }
  }, [selectedCell, data.length, columns, onDataChange, processPastedValue]);

  // Select all
  const handleSelectAll = useCallback(() => {
    if (data.length > 0 && columns.length > 0) {
      setSelectedRange({
        start: { row: 0, col: 0 },
        end: { row: data.length - 1, col: columns.length - 1 }
      });
    }
  }, [data.length, columns.length]);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number, e?: React.MouseEvent) => {
    if (e?.shiftKey && selectedCell) {
      // Extend selection
      setSelectedRange({
        start: selectedCell,
        end: { row, col }
      });
    } else {
      // Single cell selection
      setSelectedCell({ row, col });
      setSelectedRange(null);
    }
  }, [selectedCell]);

  // Handle mouse down for drag selection
  const handleMouseDown = useCallback((row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedCell({ row, col });
    setSelectedRange(null);
    setIsSelecting(true);
  }, []);

  // Handle mouse enter during drag
  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (isSelecting && selectedCell) {
      setSelectedRange({
        start: selectedCell,
        end: { row, col }
      });
    }
  }, [isSelecting, selectedCell]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  // Check if cell is selected
  const isCellSelected = useCallback((row: number, col: number) => {
    if (selectedRange) {
      const { start, end } = selectedRange;
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);
      return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
    }
    return selectedCell?.row === row && selectedCell?.col === col;
  }, [selectedCell, selectedRange]);

  // Check if cell is the active cell (for editing)
  const isActiveCell = useCallback((row: number, col: number) => {
    return selectedCell?.row === row && selectedCell?.col === col && !selectedRange;
  }, [selectedCell, selectedRange]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleKeyDown, handleMouseUp]);

  return {
    selectedCell,
    selectedRange,
    copiedData,
    isCellSelected,
    isActiveCell,
    handleCellClick,
    handleMouseDown,
    handleMouseEnter,
    handleCopy,
    handlePaste,
    handleSelectAll,
    setSelectedCell,
    setSelectedRange
  };
};
