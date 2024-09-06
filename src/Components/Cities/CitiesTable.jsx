import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import './CitiesTable.css'; // Import the CSS file

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const tableRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
  }, [page, sortColumn, sortDirection]);

  const fetchCities = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=20&start=${page * 20}&sort=${sortColumn}&order=${sortDirection}`
      );
      const data = await response.json();
      const newCities = data.records.map((record) => ({
        name: record.fields.name,
        country: record.fields.cou_name_en,
        timezone: record.fields.timezone,
      }));

      setCities((prevCities) => [...prevCities, ...newCities]);
      setFilteredCities((prevCities) => [...prevCities, ...newCities]);

      if (newCities.length === 0) setHasMore(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredCities(filtered);
    setAutocompleteSuggestions(filtered.slice(0, 10));
  };

  const handleSort = (column) => {
    const direction = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
    setCities([]);
    setPage(0);
    fetchCities();
  };

  const handleCityClick = (cityName) => {
    navigate(`/weather/${cityName}`);
  };

  const handleRightClick = (cityName, event) => {
    event.preventDefault();
    window.open(`/weather/${cityName}`, '_blank');
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleAutocompleteClick = (city) => {
    setQuery(city.name);
    setSelectedCity(city.name);
    setFilteredCities([city]);
    // Navigate to the weather page for the selected city
    navigate(`/weather/${city.name}`);
  };

  return (
    <div>
      <div className="container">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search cities..."
          className="input"
        />
        {autocompleteSuggestions.length > 0 && (
          <ul className="autocomplete">
            {autocompleteSuggestions.map((city, index) => (
              <li
                key={index}
                onClick={() => handleAutocompleteClick(city)}
                className="autocomplete-item"
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        ref={tableRef}
        className="table-container"
        onScroll={handleScroll}
      >
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                City Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('country')}>
                Country {sortColumn === 'country' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('timezone')}>
                Timezone {sortColumn === 'timezone' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map((city, index) => (
              <tr key={index}>
                <td
                  onClick={() => handleCityClick(city.name)}
                  onContextMenu={(e) => handleRightClick(city.name, e)}
                >
                  {city.name}
                </td>
                <td>{city.country}</td>
                <td>{city.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <Loader />}
        {!hasMore && <p className="no-more-cities">No more cities to load.</p>}
      </div>
    </div>
  );
};

export default CitiesTable;
