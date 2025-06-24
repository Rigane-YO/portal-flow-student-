import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ResponsiveTestSuite } from '@/components/testing/ResponsiveTestSuite';

const ResponsiveTest = () => {
  return (
    <DashboardLayout>
      <ResponsiveTestSuite />
    </DashboardLayout>
  );
};

export default ResponsiveTest;
