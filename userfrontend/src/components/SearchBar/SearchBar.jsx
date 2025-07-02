import React, { useState } from 'react'
import './SearchBar.css'
import { assets } from '../../assets/assets'

const SearchBar = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('default')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value, sortOption)
  }

  const handleSortChange = (e) => {
    const value = e.target.value
    setSortOption(value)
    onSearch(searchTerm, value)
  }

  return (
    <div className='search-bar'>
      <div className='search-input-container'>
        <img src={assets.search_icon} alt="search" />
        <input 
          type="text" 
          placeholder="Search for food items..." 
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className='filter-container'>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="default">Sort By</option>
          <option value="mostFavorited">Most Favorited</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}

export default SearchBar 