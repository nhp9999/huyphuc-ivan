import React, { useState } from 'react';
import { Search } from 'lucide-react';
import BhxhCheckModal from './BhxhCheckModal';

interface BhxhCheckButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success';
  children?: React.ReactNode;
}

const BhxhCheckButton: React.FC<BhxhCheckButtonProps> = ({
  className = '',
  size = 'md',
  variant = 'success',
  children
}) => {
  const [showModal, setShowModal] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      default:
        return 'bg-green-600 hover:bg-green-700 text-white';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`
          inline-flex items-center font-medium rounded-lg transition-colors
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${className}
        `}
      >
        <Search className="w-4 h-4 mr-2" />
        {children || 'Kiểm tra mã BHXH'}
      </button>

      <BhxhCheckModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default BhxhCheckButton;
