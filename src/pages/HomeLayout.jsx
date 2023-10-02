import React from 'react';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <div>
      {/* <h3>navbar in home layout page component</h3> */}
      <Outlet />
    </div>
  );
};

export default HomeLayout;
