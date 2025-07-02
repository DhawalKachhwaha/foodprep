import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from 'axios'
import {toast} from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {
  const {url, token, setToken, loadFavorites} = useContext(StoreContext)
  const [curState, setCurState] = useState("Log In");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const popupRef = useRef(null);
  
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowLogin(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowLogin]);
  
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowLogin(false);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [setShowLogin]);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Validate password
    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Validate name for signup
    if (curState === "Sign Up" && !data.name) {
      newErrors.name = "Name is required";
    }
    
    // Validate terms checkbox
    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    let newUrl = url;
    
    if (curState === "Log In") {
      newUrl += '/api/user/login';
    } else {
      newUrl += '/api/user/register';
    }
    
    try {
      const response = await axios.post(newUrl, data);
      
      if (curState === "Sign Up") {
        toast.success("Account created successfully! Please Log in");
        setCurState("Log In");
        // Reset form after successful signup
        setData({
          ...data,
          name: "",
          password: ""
        });
      } else {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem("token", newToken);
        // Load user favorites right after login
        await loadFavorites(newToken);
        toast.success("Logged in successfully!");
        setShowLogin(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchMode = () => {
    // Reset errors when switching modes
    setErrors({});
    // Reset form when switching modes
    setData({
      name: "",
      email: "",
      password: ""
    });
    setCurState(curState === "Log In" ? "Sign Up" : "Log In");
  };

  return (
    <div className="login-popup">
      <form ref={popupRef} onSubmit={onSubmitHandler} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{curState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        
        <div className="login-popup-inputs">
          {curState !== "Log In" && (
            <div className="form-group">
              <input
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                type="text"
                placeholder="Your Name"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}
          
          <div className="form-group">
            <input
              name="email"
              value={data.email}
              onChange={onChangeHandler}
              type="email"
              placeholder="Your Email"
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <input
              name="password"
              value={data.password}
              onChange={onChangeHandler}
              type="password"
              placeholder="Password"
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
        </div>
        
        <div className="login-popup-condition">
          <input 
            type="checkbox" 
            checked={agreeToTerms}
            onChange={() => {
              setAgreeToTerms(!agreeToTerms);
              if (errors.terms) {
                setErrors({ ...errors, terms: null });
              }
            }}
            className={errors.terms ? "error" : ""}
          />
          <p>
            By continuing, I agree to terms & privacy policy
            {errors.terms && <span className="error-message">{errors.terms}</span>}
          </p>
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={isLoading ? "loading" : ""}
        >
          {isLoading ? "Processing..." : curState}
        </button>
        
        {curState === "Log In" ? (
          <p>
            Create a new account?
            <span onClick={switchMode}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={switchMode}>Log in here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
