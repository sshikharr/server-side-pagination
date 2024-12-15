import React from 'react';
import DataTableComponent from './components/DataTableComponent';
import './App.css';

// App is the main component of the application
const App: React.FC = () => {
  return (
    <div className="App">
      <DataTableComponent />
    </div>
  );
};

export default App;