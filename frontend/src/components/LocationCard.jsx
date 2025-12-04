import React from 'react'
import restaurantImg from '../assets/images/images.jpg'
import '../assets/style/LocationCard.css'
const LocationCard = () => {
  return (
    <>
    <div className="card">
        <div className="card-head">
        <img src= {restaurantImg} alt="" />
        </div>
        <div className="card-body">
        <div className="review"> 5 star</div>
        <div className="title">Lorem, ipsum.</div>
        </div>
    </div>
    </>
  )
}

export default LocationCard