import {useState,useEffect,useContext} from 'react'
import './FoodItem.css'
import {assets} from '../../assets/assets'
import {StoreContext} from '../../context/StoreContext'

const FoodItem = ({id,name,description,price,image}) => {
  const {cartItems,setCartItems,addToCart,removeFromCart,url } = useContext(StoreContext);


  return (
    <div className='food-item'> 
      <div className="food-item-image-container">
        <img className='food-item-image' src={`${url}/image/${image}`} alt="" />
        {
          !cartItems[id]
            ? <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
            : <div className="food-item-counter">
                <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                <p className='food-count'>{cartItems[id]}</p>
                <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
            </div>
        }
      </div>

      <div className="food-item-info">
          <p className='food-item-name'>{name}</p>
          <p className='food-item-desc'>{description}</p>
          <div className="food-item-price-rating">
            <p className='food-item-price'>₹{price}</p>
            <img src={assets.rating_starts} alt="" />
          </div>
      </div>  
    </div>
  )
}

export default FoodItem
