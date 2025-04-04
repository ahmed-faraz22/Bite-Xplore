import React from 'react'
import '../assets/style/Button.css'

const Button = ({buttonLink,buttonText}) => {
  return (
    <>
    <a className='btn' href={buttonLink}>{buttonText}</a>
    </>
  )
}

export default Button