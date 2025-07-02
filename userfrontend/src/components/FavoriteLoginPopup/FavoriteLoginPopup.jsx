import { useContext } from "react";
import "./FavoriteLoginPopup.css";
import { assets } from "../../assets/assets";

const FavoriteLoginPopup = ({ setShowFavoriteLogin, setShowLogin }) => {
  const handleLogin = () => {
    setShowFavoriteLogin(false);
    setShowLogin(true);
  };

  return (
    <div className="favorite-login-popup">
      <div className="favorite-login-popup-container">
        <div className="favorite-login-popup-title">
          <h2>Login Required</h2>
          <img
            onClick={() => setShowFavoriteLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="favorite-login-popup-content">
          <img src={assets.heart_outline} alt="heart" className="heart-icon" />
          <p>Please login to add items to your favorites</p>
        </div>
        <button onClick={handleLogin}>Login Now</button>
      </div>
    </div>
  );
};

export default FavoriteLoginPopup; 