import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BigSidebar, SmallSidebar, Navbar } from '../components';
import Wrapper from '../assets/wrappers/Dashboard';

import { useState, createContext, useContext } from 'react';
import { checkDefaultTheme } from '../App';

// create a glogal context in DashboardContext
// Define the custom hook in the bottom of the page
const DashboardContext = createContext();

const DashboardLayout = () => {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());

  const user = JSON.parse(localStorage.getItem('user'));

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    console.log('logout user');
  };

  useEffect(() => {
    // console.log(navigate());
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}>
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

//  custom useContext hook
export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
