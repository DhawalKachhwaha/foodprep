import {useState,useContext,useEffect,useRef} from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import {Link,useLocation} from 'react-router-dom'
import {StoreContext} from '../../context/StoreContext'
import {useNavigate} from'react-router-dom'

const Navbar = ({showLogin,setShowLogin}) => {
    const [menu, setMenu] = useState('home')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const {getTotalCartAmount,token,setToken} = useContext(StoreContext);
    const navigate = useNavigate()
    const location = useLocation()
    const dropdownRef = useRef(null)
    
    useEffect(() => {
        // Set active menu based on current path
        if (location.pathname === '/') {
            setMenu('home')
        } else if (location.pathname === '/cart') {
            setMenu('cart')
        } else if (location.pathname === '/profile') {
            setMenu('profile')
        }
        
        // Close mobile menu when route changes
        setMobileMenuOpen(false)
        // Close profile dropdown when route changes
        setProfileDropdownOpen(false)
    }, [location.pathname])
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false)
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    
    const logout=()=>{
        localStorage.removeItem("token");
        setToken("")
        navigate('/')
    }
    
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }
    
    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen)
    }

  return (
    <div className="navbar">
        <Link to='/' className="navbar-logo">
            <img className='logo' src={assets.logo} alt="Food Service Logo" />
        </Link>
        
        {/* Mobile menu toggle */}
        <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
        >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
        
        <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link 
                to='/' 
                className={menu === 'home' ? 'active' : ''} 
                onClick={() => setMenu('home')}
            >
                Home
            </Link>
            <a 
                href='#food-display' 
                className={menu === 'menu' ? 'active' : ''} 
                onClick={() => setMenu('menu')}
            >
                Menu
            </a>
            <a 
                href='#footer' 
                className={menu === 'contact-us' ? 'active' : ''} 
                onClick={() => setMenu('contact-us')}
            >
                Contact us
            </a>
        </ul>
        
        <div className="navbar-right">
            <div className="cart-icon">
                <Link to='/cart'>
                    <img src={assets.basket_icon} alt="Shopping Cart" />
                    {getTotalCartAmount() !== 0 && <span className="cart-count">{getTotalCartAmount()}</span>}
                </Link>
            </div>
        {
            !token 
                ?  <button className="btn btn-outline signin-btn" onClick={()=>setShowLogin(true)}>Sign in</button> 
                : <div className='navbar-profile' ref={dropdownRef}>
                    <img 
                        src={assets.profile_icon} 
                        alt="User Profile" 
                        onClick={toggleProfileDropdown}
                    />
                    <ul className={`nav-profile-dropdown ${profileDropdownOpen ? 'show' : ''}`}>
                        <Link to="/profile"><li className="profile-item">Profile</li></Link>
                        <hr />
                        <li onClick={logout} className="logout-item"><img src={assets.logout_icon} alt="Logout" /><p>Logout</p></li>
                    </ul>
                </div>
        }
          
        </div>
    </div>
  )
}

export default Navbar