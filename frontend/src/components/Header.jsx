import React from 'react'
import '../assets/style/Header.css'
import logo from '../assets/images/logo.png'
import Button from './Button'

const Header = () => {
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
                <li>Home</li>
                <li>About</li>
                <li>Products</li>
                <li>Contact</li>
                <li>Faq</li>
            </ul>
        </nav>

        <div className="header-cta">
            <Button/>
            <Button/>
        </div>
            </div>
        </div>
    </header>
    </>
  )
}

export default Header