import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Mainpage from './pages/MainPage/MainPage';
import './App.css';

function App() {

  const router = (
    <Route path="/" exact component={Mainpage} />
  );

  return (
    <BrowserRouter>
      <div className="App">
        {router}
      </div>
    </BrowserRouter>
  );
}

export default App;
