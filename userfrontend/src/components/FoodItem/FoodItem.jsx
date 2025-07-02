import {useState,useEffect,useContext} from 'react'
import './FoodItem.css'
import {assets} from '../../assets/assets'
import {StoreContext} from '../../context/StoreContext'

const FoodItem = ({id,name,description,price,image,no_of_favorites,setShowFavoriteLogin}) => {
  const {cartItems,setCartItems,addToCart,removeFromCart,url,favorites,addToFavorites,removeFromFavorites,token} = useContext(StoreContext);
  const [favCount, setFavCount] = useState(no_of_favorites || 0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Update the favorite count when the prop changes
  useEffect(() => {
    if (no_of_favorites !== undefined) {
      setFavCount(no_of_favorites);
      // console.log(`Food item ${id} has ${no_of_favorites} favorites`);
    }
  }, [no_of_favorites, id]);

  const handleFavoriteToggle = async () => {
    if (!token) {
      // Show favorite login popup instead of alert
      setShowFavoriteLogin(true);
      return;
    }
    
    // Prevent multiple clicks while processing
    if (isProcessing) {
      return;
    }
    
    setIsProcessing(true);
    
    const isFavorited = favorites.includes(id);
    // console.log(`Toggling favorite for ${id}. Current status: ${isFavorited ? 'Favorited' : 'Not favorited'}`);
    
    try {
      if (isFavorited) {
        // Temporarily decrement the count for immediate feedback
        setFavCount(prev => Math.max(0, prev - 1));
        await removeFromFavorites(id);
      } else {
        // Temporarily increment the count for immediate feedback
        setFavCount(prev => prev + 1);
        await addToFavorites(id);
      }
    } catch (error) {
      // console.error("Error toggling favorite:", error);
      // Revert the count change if there was an error
      if (isFavorited) {
        setFavCount(prev => prev + 1);
      } else {
        setFavCount(prev => Math.max(0, prev - 1));
      }
    } finally {
      setIsProcessing(false);
    }
  };

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
          <div className="food-item-price-favorite">
            <p className='food-item-price'>₹{price}</p>
            <div className="favorite-container">
              <img 
                className={`favorite-icon ${isProcessing ? 'processing' : ''}`}
                src={favorites.includes(id) ? assets.heart_filled : assets.heart_outline} 
                alt="favorite" 
                onClick={handleFavoriteToggle}
              />
              <span className="favorite-count">{favCount}</span>
            </div>
          </div>
      </div>  
    </div>
  )
}

export default FoodItem
