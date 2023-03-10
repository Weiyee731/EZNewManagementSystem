import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from '../components/sidebar/Layout';
import './App.scss';
import './App_modified.css';


const App = () => (
  <Router basename={"/CMS"}>
    <Layout />
  </Router>
);

export default App;
