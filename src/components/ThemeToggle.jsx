import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import Wrapper from '../assets/wrappers/ThemeToggle';
import { useDashboardContext } from '../pages/DashboardLayout';

const ThemeToggle = () => {
  const { isDarkTheme, toggleDarkTheme } = useDashboardContext();
  return (
    <Wrapper onClick={toggleDarkTheme}>
      {/* Desgin of Shabtay */}
      <div className={isDarkTheme ? 'strip strip-moon' : 'strip strip-sun'}></div>
      <div className={isDarkTheme ? 'icon-moon' : 'icon-sun'}>
        <div className={isDarkTheme ? 'circle-icon-moon-fill' : 'circle-icon-sun-fill'}></div>
        {isDarkTheme ? <BsFillSunFill style={{ color: 'black' }} /> : <BsFillMoonFill style={{ color: 'white' }} />}
      </div>

      {/* Design of john */}
      {/* {isDarkTheme ? <BsFillSunFill className="toggle-icon-sun" /> : <BsFillMoonFill className="toggle-icon-moon" />} */}
    </Wrapper>
  );
};

export default ThemeToggle;
