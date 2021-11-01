import React from 'react';
import reactLogo from '../../assets/logos/logo.svg';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const Main = ({
  collapsed,
  rtl,
  handleToggleSidebar,
  handleCollapsedChange,
  handleRtlChange,
  handleImageChange,
}) => {
  return (
    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <MenuOutlinedIcon />
      </div>
      <header>
        <h1>
          <img width={80} src={reactLogo} alt="react logo" /> EZ Logitstic Management
        </h1>
      </header>

      <div className="block ">
        <p>Testing</p>
      </div>

      <footer>
        <small>
          © {new Date().getFullYear()} 
        </small>
        <br />
        <div className="social-bagdes">
          <a href="https://github.com/azouaoui-med" target="_blank" rel="noopener noreferrer">
            <img
              alt="GitHub followers"
              src="https://img.shields.io/github/followers/azouaoui-med?label=github&style=social"
            />
          </a>
          <a href="https://twitter.com/azouaoui_med" target="_blank" rel="noopener noreferrer">
            <img
              alt="Twitter Follow"
              src="https://img.shields.io/twitter/follow/azouaoui_med?label=twitter&style=social"
            />
          </a>
        </div>
      </footer>
    </main>
  );
};

export default Main;