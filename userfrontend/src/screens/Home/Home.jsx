import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import {useState, useEffect, useContext} from "react"
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import SearchBar from '../../components/SearchBar/SearchBar'
import {StoreContext} from '../../context/StoreContext'

const Home = ({ setShowFavoriteLogin }) => {
  const [category, setCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("default")
  const [filteredFoodList, setFilteredFoodList] = useState([])
  const {food_list} = useContext(StoreContext)

  useEffect(() => {
    filterAndSortFoodItems(searchQuery, sortOption)
  }, [category, searchQuery, sortOption, food_list])

  const filterAndSortFoodItems = (query, sort) => {
    // Filter by category first (if not "All")
    let filtered = food_list.filter(item => 
      category === "All" || item.category === category
    )

    // Then filter by search query
    if (query) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Sort the filtered items based on the selected option
    switch (sort) {
      case "mostFavorited":
        filtered.sort((a, b) => {
          // Default to 0 if no_of_favorites is undefined
          const aFavs = a.no_of_favorites || 0;
          const bFavs = b.no_of_favorites || 0;
          return bFavs - aFavs; // Sort in descending order (most to least)
        });
        break;
      case "lowToHigh":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "highToLow":
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        // Keep default order
        break
    }

    setFilteredFoodList(filtered)
  }

  const handleSearch = (query, sort) => {
    setSearchQuery(query)
    setSortOption(sort)
  }

  return (
    <div className='home'>
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <SearchBar onSearch={handleSearch} />
      <FoodDisplay 
        category={category} 
        customFoodList={filteredFoodList} 
        setShowFavoriteLogin={setShowFavoriteLogin} 
      />
    </div>
  )
}

export default Home
