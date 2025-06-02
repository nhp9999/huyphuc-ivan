import React from 'react';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import { CSKCBProvider } from '../contexts/CSKCBContext';
import { KeKhai603FormContent } from '../components/KeKhai603FormContent';

const KeKhai603Form: React.FC = () => {
  const { pageParams } = useNavigation();

  return (
    <CSKCBProvider>
      <KeKhai603FormContent pageParams={pageParams} />
    </CSKCBProvider>
  );
};

export default KeKhai603Form;
