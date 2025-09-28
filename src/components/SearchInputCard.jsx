import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const SearchInputCard = ({
  placeholder = 'Search...',
  value = '',
  onChange = () => {},
  onInputClick = () => {},
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="card-basic m-0 border-0 shadow-sm" id="searchInputCard">
      <div className="top">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <div className="search-cont">
              <input
                type="text"
                placeholder={placeholder}
                className="form-control"
                onClick={onInputClick}
                value={value}
                onChange={onChange}
                id="main-search"
              />
              <span className="search-icon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
            </div>
          </div>
          <div className="ms-3">
            <button
              className="btn-main btn-solid"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FontAwesomeIcon icon={faSliders} />
            </button>
          </div>
        </div>
      </div>

      <div className={`filter-section ${showFilters ? 'open' : ''}`}>
        <div className="mt-2 filters">
          <div className="row">
            <div className="col-6 my-2">
              <label className="mb-1">Sort By:</label>
              <select className="form-select">
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            <div className="col-6 my-2">
              <label className="mb-1">Category By:</label>
              <select className="form-select">
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInputCard;
