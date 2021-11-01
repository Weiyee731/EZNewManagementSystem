import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from '../components/sidebar/Layout';
import './App.scss';

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;
