import {useContext} from 'react'
import './FoodDisplay.css'
import {StoreContext} from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category, customFoodList}) => {
  const {food_list} = useContext(StoreContext)
  
  // Use customFoodList if provided, otherwise filter the food_list based on category
  const displayFoodList = customFoodList || food_list.filter(item => 
    category === 'All' || category === item.category
  )

  return (
    <div className='food-display' id='food-display'> 
      <h2>Top dishes near you</h2>
      {displayFoodList.length === 0 ? (
        <div className="no-results">No dishes found matching your criteria</div>
      ) : (
        <div className="food-display-list">
          {displayFoodList.map((item, index) => (
            <FoodItem 
              key={index} 
              id={item._id} 
              name={item.name} 
              image={item.image} 
              price={item.price} 
              description={item.description}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
