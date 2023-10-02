import React from 'react';
import Wrapper from '../assets/wrappers/BigSidebar';
import NavLinks from './NavLinks';
import Logo from './Logo';
import { useDashboardContext } from '../pages/DashboardLayout';

const BigSidebar = () => {
  const { showSidebar } = useDashboardContext();
  // Sometimes I'm getting showSidebar is undefined / dont't know the reason for that
  // And getting Errpr Page
  // Work Around, enable the log, refresh page , and page loads again w/n issue
  // console.log(showSidebar);
  return (
    <Wrapper>
      <div className={showSidebar ? 'sidebar-container ' : 'sidebar-container show-sidebar'}>
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
