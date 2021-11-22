import React from 'react';
import reactLogo from '../../assets/logos/logo.svg';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import routes from './data/RouterConfiguration';
import Footer from './Footer';
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

      {/* You can design your header here */}
      {/* <header>

</header> */}

      <div className="block">
        <Switch>
          {
            routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                >
                  {route.element}
                </Route>
              )
            })
          }
        </Switch>
      </div>
      <Footer />
    </main>
  );
};

export default Main;