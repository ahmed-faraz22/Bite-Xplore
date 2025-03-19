import React from 'react'
import '../assets/style/Foodcard.css'
import cardBg from '../assets/images/foodiesfeed.com_colorful-bowl-of-deliciousness-with-fried-egg.png'

const Foodcard = ({width}) => {

  return (
    <>
    <div className="card-wrapper" style={{background: `url(${cardBg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', objectFit: 'center', backgroundSize: 'cover'}}>
      <div className="card-description">
        <strong>Name</strong>
      </div>
    </div>
    </>
  )
}

export default Foodcard