import { createContext,useState,useEffect } from "react";
import axios from 'axios'
export const StoreContext = createContext();
const StoreContextProvider = ({children})=>{
    const [cartItems,setCartItems] = useState({})
    const [food_list,setFoodList] = useState([])
    const [favorites, setFavorites] = useState([])
    const url = 'https://foodprepbackend.onrender.com'
    //const url = 'http://localhost:4000'
    
    const [token,setToken] = useState("")

    const [lastFavoritesUpdate, setLastFavoritesUpdate] = useState(0);

    const fetchFoodList = async()=>{
        try {
            const response = await axios.get(url+'/api/food/list')
            console.log("Fetched food list:", response.data.data);
            setFoodList(response.data.data)
        } catch (error) {
            console.log("Error fetching food list:", error);
        }
    }

    useEffect(()=>{
        async function loadData(){
            await fetchFoodList()
            if(localStorage.getItem("token")){
                const savedToken = localStorage.getItem("token");
                console.log("Found token in localStorage:", savedToken ? "Yes" : "No");
                setToken(savedToken) 
                await loadCartData(savedToken)
                await loadFavorites(savedToken)       
            }
        }
        loadData()
    },[])
    
    useEffect(() => {
        if (token) {
            console.log("Token changed, reloading user data");
            loadCartData(token)
            loadFavorites(token)
        }
    }, [token])
    
    const loadCartData = async(token)=>{
        try {
            const response = await axios.get(url+"/api/cart/get",{headers:{token}})
            setCartItems(response.data.cartData)
        } catch (error) {
            console.log("Error loading cart data:", error);
        }
    }

    const loadFavorites = async(token)=>{
        // Prevent excessive API calls by checking the time since the last update
        const now = Date.now();
        if (now - lastFavoritesUpdate < 2000) { // 2 seconds throttle
            // console.log("Skipping favorites load - too soon since last update");
            return;
        }
        
        try {
            // console.log("Loading favorites with token:", token ? "Yes" : "No");
            const response = await axios.get(url+"/api/user/favorites",{headers:{token}})
            // console.log("Received favorites from server:", response.data.favorites);
            setFavorites(response.data.favorites || [])
            setLastFavoritesUpdate(now);
        } catch (error) {
            // console.log("Error loading favorites:", error);
        }
    }

    const addToFavorites = async(itemId)=>{
        // console.log("Adding to favorites:", itemId);
        
        // Store current favorites to revert if needed
        const previousFavorites = [...favorites];
        
        // Immediately update UI
        if(!favorites.includes(itemId)) {
            setFavorites(prev => [...prev, itemId])
        }

        if(token){
            try {
                const response = await axios.post(url+"/api/user/favorites/add",{itemId},{headers:{token}})
                // console.log("Server response for add favorite:", response.data);
                
                // Refresh favorites from server instead of food list
                const now = Date.now();
                setLastFavoritesUpdate(now);
                await loadFavorites(token);
            } catch (error) {
                // console.log("Error adding to favorites:", error);
                // Revert UI change if there was an error
                setFavorites(previousFavorites);
                alert("Failed to add favorite. Please try again.");
            }
        }
    }

    const removeFromFavorites = async(itemId)=>{
        // console.log("Removing from favorites:", itemId);
        
        // Store current favorites to revert if needed
        const previousFavorites = [...favorites];
        
        // Immediately update UI
        setFavorites(prev => prev.filter(id => id !== itemId))

        if(token){
            try {
                const response = await axios.delete(`${url}/api/user/favorites/remove?itemId=${itemId}`,{headers:{token}})
                // console.log("Server response for remove favorite:", response.data);
                
                // Refresh favorites from server instead of food list
                const now = Date.now();
                setLastFavoritesUpdate(now);
                await loadFavorites(token);
            } catch (error) {
                // console.log("Error removing from favorites:", error);
                // Revert UI change if there was an error
                setFavorites(previousFavorites);
                alert("Failed to remove favorite. Please try again.");
            }
        }
    }

    const getFavoriteItems = () => {
        const items = food_list.filter(food => favorites.includes(food._id));
        // console.log("Favorite items:", items);
        return items;
    }

    const addToCart=async(itemId)=>{
        if(!cartItems[itemId])
            setCartItems({...cartItems,[itemId]:1})
        else
            setCartItems({...cartItems,[itemId]:cartItems[itemId]+1})

        if(token){
            try {
                await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
            } catch (error) {
                console.log(error)
            }
        }
    }

    const removeFromCart=async(itemId)=>{
        setCartItems({...cartItems,[itemId]:cartItems[itemId]-1})

        if(token){
            try {
                await axios.delete(`${url}/api/cart/remove?itemId=${itemId}`,{headers:{token}})
            } catch (error) {
                console.log(error)
            }
        }
    }

    const getTotalCartAmount=()=>{
        let total=0;
        for(let eltId in cartItems ){
            if(cartItems[eltId]>0){
                let itemInfo = food_list.find(food=>food._id==eltId)
                total+=itemInfo.price * cartItems[eltId]
            }
        }
        return total;
    }

    const contextValue={
        cartItems,
        setCartItems,
        food_list,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        favorites,
        addToFavorites,
        removeFromFavorites,
        getFavoriteItems,
        loadFavorites,
        fetchFoodList
    }
    return(
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider