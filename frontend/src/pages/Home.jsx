import React from 'react'
import Hero from '../components/Hero'
import NearbyRestaurants from '../components/NearbyRestaurants'
import Products from '../components/Products'
import Header from '../components/Header'

const Home = () => {
  return (
    <>
    <Header/>
    <Hero/>
    <NearbyRestaurants/>
    <Products/>
    </>
  )
}

export default Home