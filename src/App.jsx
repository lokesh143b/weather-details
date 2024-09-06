import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CitiesTable from './Components/Cities/CitiesTable';
import WeatherPage from './Components/WeatherPage/WeatherPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitiesTable />} />
        <Route path="/weather/:cityName" element={<WeatherPage />} />
      </Routes>
    </Router>
  );
};

export default App;
