import React, { useState } from 'react'
import '../assets/style/Header.css'
import logo from '../assets/images/logo.png'
import Button from './Button'

const Header = () => {
    const [menuToggle, setMenuToggle] = useState(false)
    const soda = () => {
        setMenuToggle(prevState => !prevState)
    }

  return (
    <>
    <header>
        <div className="container">
            <div className="inner">
                <div className="site-logo">
                    <img src={logo} alt="" />
                </div>
            <nav>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>

        <div className="header-cta">
            <Button/>
        </div>

        <div className="mobile-menu">
            <div className="mobile-btn" onClick={soda}>
                <div className="btn-bar"></div>
                <div className="btn-bar"></div>
                <div className="btn-bar"></div>
            </div>

            <div className={`mobile-nav ${menuToggle ? "active" : ""}`}>
            <nav>
                <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">Contact</a></li>
                </ul>
            </nav>
            </div>

        </div>
            </div>
        </div>
    </header>
    </>
  )
}

export default Header