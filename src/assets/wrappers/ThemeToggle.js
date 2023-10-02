import styled from 'styled-components';

const Wrapper = styled.div`
  /* 
* This is John original code 
*
*/
  /* background: transparent;
  border-color: transparent;
  width: 3.5rem;
  height: 2rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  .toggle-icon {
    font-size: 1.15rem;
    color: var(--text-color);
  } */

  /*
  * This Is my CSS implementation for Theme  
  * 1. with transform + transition
  * 2. with animation
  */

  /* border: 2px solid var(--primary-500); */
  border-radius: 10px;
  width: 3rem;
  height: 1.68rem;
  margin-right: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  position: relative;

  .strip {
    position: absolute;
    top: 8px;
    left: 10px;
    margin: 0 auto;
    width: 1.3rem;
    height: 0.5rem;
    border-radius: 10px;
  }

  .strip-moon {
    background-color: var(--grey-500);
  }

  .strip-sun {
    background-color: var(--grey-300);
  }

  .icon-sun {
    /* must set both ucon-sun and icon-moon with sane : margin 1.2rem */
    margin-right: 1.2rem;
    font-size: 0.875rem;
    transform: translateX(18px);
    transition: transform 0.25s linear 0s;
    position: relative;
  }

  .icon-moon {
    margin-right: 1.2rem;
    font-size: 0.875rem;
    transform: translateX(-6px);
    transition: transform 0.25s linear 0s;
    position: relative;
  }

  .circle-icon-sun-fill {
    border-radius: 50%;
    background-color: var(--text-color);
    width: 25px;
    height: 25px;
    position: absolute;
    top: -6px;
    left: -6px;
    z-index: -1;
  }

  .circle-icon-moon-fill {
    border-radius: 50%;
    background-color: var(--dark-mode-text-color);
    background-color: var(--text-color);
    width: 25px;
    height: 25px;
    position: absolute;
    top: -6px;
    left: -5px;
    z-index: -1;
  }

  /* .icon-sun {
    border-radius: 10px;
    margin: 0 0.375rem;
    width: 1.5rem;
    font-size: 1rem;
    color: var(--primary-500);
    animation-name: sun;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }

  .icon-moon {
    border-radius: 10px;
    margin: 0 0.375rem;
    width: 1.5rem;
    font-size: 1rem;
    color: var(--text-color);
    animation-name: moon;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
  @keyframes sun {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(25px);
    }
  }

  @keyframes moon {
    0% {
      transform: translateX(25px);
    }
    100% {
      transform: translateX(0px);
    }
  } */
`;
export default Wrapper;
