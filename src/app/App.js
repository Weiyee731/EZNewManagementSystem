import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from '../components/sidebar/Layout';
import './App.scss';

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;
