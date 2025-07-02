import {useState, useContext, useEffect} from 'react'
import {StoreContext} from '../../context/StoreContext'
import axios from 'axios'
import Loader from '../../components/Loader/Loader'
import './Profile.css'
import {assets} from '../../assets/assets'
import FoodItem from '../../components/FoodItem/FoodItem'

const Profile = ({ setShowFavoriteLogin }) => {
    const [orders, setOrders] = useState([])
    const [activeTab, setActiveTab] = useState('favorites')
    const [isLoading, setIsLoading] = useState(true)
    const [favoriteSortOption, setFavoriteSortOption] = useState('default')
    const {url, token, favorites, getFavoriteItems, fetchFoodList, loadFavorites} = useContext(StoreContext)
    
    // Get the favorite items
    const favoriteItems = getFavoriteItems()
    
    // Sort favorite items based on selected option
    const sortedFavoriteItems = [...favoriteItems].sort((a, b) => {
        switch(favoriteSortOption) {
            case 'mostFavorited':
                const aFavs = a.no_of_favorites || 0;
                const bFavs = b.no_of_favorites || 0;
                return bFavs - aFavs;
            case 'lowToHigh':
                return a.price - b.price;
            case 'highToLow':
                return b.price - a.price;
            default:
                return 0; // No sorting
        }
    });
    
    // Only refresh the food list once when the tab changes to favorites
    useEffect(() => {
        if (activeTab === 'favorites') {
            // We only need to fetch the food list once when viewing favorites
            fetchFoodList();
        }
    }, [activeTab]);

    const fetchOrders = async() => {
        try {
            const response = await axios.get(`${url}/api/order/userorders`, {headers: {token}})
            setOrders(response.data.data)
        } catch (error) {
            console.log("error fetching orders", error)
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(token) {
            fetchOrders()
            // Also refresh favorites when Profile is loaded, but only once
            loadFavorites(token)
        } else {
            setIsLoading(false)
        }
    }, [token]);

    const handleSortChange = (e) => {
        setFavoriteSortOption(e.target.value);
    };

    if(isLoading)
        return <Loader/>

    return (
        <div className="profile">
            <h2>My Profile</h2>
            
            <div className="profile-tabs">
                <button 
                    className={activeTab === 'favorites' ? 'active' : ''} 
                    onClick={() => setActiveTab('favorites')}
                >
                    My Favorites
                </button>
                <button 
                    className={activeTab === 'orders' ? 'active' : ''} 
                    onClick={() => setActiveTab('orders')}
                >
                    My Orders
                </button>
            </div>

            {activeTab === 'favorites' && (
                <div className="favorites-section">
                    {favoriteItems.length > 0 ? (
                        <>
                            <div className="favorites-sort">
                                <select value={favoriteSortOption} onChange={handleSortChange}>
                                    <option value="default">Sort By</option>
                                    <option value="mostFavorited">Most Favorited</option>
                                    <option value="lowToHigh">Price: Low to High</option>
                                    <option value="highToLow">Price: High to Low</option>
                                </select>
                            </div>
                            <div className="favorites-container">
                                {sortedFavoriteItems.map((item) => (
                                    <FoodItem 
                                        key={item._id}
                                        id={item._id}
                                        name={item.name}
                                        image={item.image}
                                        price={item.price}
                                        description={item.description}
                                        no_of_favorites={item.no_of_favorites || 0}
                                        setShowFavoriteLogin={setShowFavoriteLogin}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="no-items">No favorite items yet!</p>
                    )}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="orders-section">
                    {orders.length > 0 ? (
                        <div className="container">
                            {orders.map((order, index) => (
                                <div key={index} className="profile-order">
                                    <img src={assets.parcel_icon} alt="" />
                                    <p>
                                        {order.items.map((item, itemIndex) => {
                                            if(itemIndex === order.items.length-1) {
                                                return item.name + " x " + item.quantity
                                            } else {
                                                return item.name + " x " + item.quantity + ", "
                                            }
                                        })}
                                    </p>
                                    <p>₹{order.amount}</p>
                                    <p>Items: {order.items.length}</p>
                                    <p><span>&#x25cf;</span><b>{order.status}</b></p>
                                    <button onClick={fetchOrders}>Track Order</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-items">No orders found!</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Profile 