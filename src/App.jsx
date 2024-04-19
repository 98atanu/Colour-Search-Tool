// src/App.js
import React from 'react';
import ColourSearchTool from './components/ColourSearchTool';
import Header from './components/Header';

const App = () => {
  return (
    <div className='bg bg-slate-200 h-screen px-6 py-10 overflow-scroll'>
      <Header/>
      <ColourSearchTool/>
    </div>
  );
};

export default App;
