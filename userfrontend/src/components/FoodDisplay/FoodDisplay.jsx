import { useContext, useState, useEffect } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import Loader from '../Loader/Loader'

const FoodDisplay = ({ category, customFoodList, setShowFavoriteLogin }) => {
  const { food_list } = useContext(StoreContext)
  const [isLoading, setIsLoading] = useState(true)
  const [displayItems, setDisplayItems] = useState([])
  
  useEffect(() => {
    // Simulate loading state for better UX
    setIsLoading(true)
    
    setTimeout(() => {
      // Use customFoodList if provided, otherwise filter the food_list based on category
      const filteredList = customFoodList || food_list.filter(item => 
        category === 'All' || category === item.category
      )
      
      setDisplayItems(filteredList)
      setIsLoading(false)
    }, 500)
  }, [customFoodList, food_list, category])
  
  return (
    <div className='food-display' id='food-display'> 
      <div className="section-header">
        <h2>Top Dishes Near You</h2>
        <p className="section-subtitle">
          {category !== 'All' 
            ? `Exploring our ${category} collection` 
            : 'Discover delicious meals from our menu'}
        </p>
      </div>
      
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : displayItems.length === 0 ? (
        <div className="no-results">
          <div className="no-results-content">
            <h3>No dishes found</h3>
            <p>We couldn't find any dishes matching your criteria. Try adjusting your filters.</p>
          </div>
        </div>
      ) : (
        <div className="food-display-list">
          {displayItems.map((item, index) => (
            <div className="food-item-wrapper" key={index}>
              <FoodItem 
                id={item._id} 
                name={item.name} 
                image={item.image} 
                price={item.price} 
                description={item.description}
                no_of_favorites={item.no_of_favorites || 0}
                setShowFavoriteLogin={setShowFavoriteLogin}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
