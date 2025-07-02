import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

const Header = () => {
  return (
    <div className='header'> 
      <div className="header-overlay"></div>
      <div className="header-contents">
        <span className="header-badge">Fast Delivery</span>
        <h1>Delicious Food <br />Delivered To Your Door</h1>
        <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
        <div className="header-buttons">
          <a href='#food-display'>
            <button className="btn-primary">Explore Menu</button>
          </a>
          <a href='#footer' className="btn-text">
            Contact Us <span className="arrow">→</span>
          </a>
        </div>
        <div className="header-features">
          <div className="feature">
            <img src={assets.parcel_icon} alt="Fast Delivery" />
            <span>Fast Delivery</span>
          </div>
          <div className="feature">
            <img src={assets.basket_icon} alt="Easy Orders" />
            <span>Easy Ordering</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
