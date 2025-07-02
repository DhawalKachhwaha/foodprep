import React from 'react'
import './Loader.css'

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
      <p className="loading-text">Loading</p>
    </div>
  )
}

export default Loader