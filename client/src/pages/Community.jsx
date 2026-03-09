import React, { useState } from 'react'
import { dummyPublishedImages } from '../assets/assets'

const Community = () => {

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchImages = async () => {
    setImages(dummyPublishedImages)
    setLoading(false)
  }
  
  return (
    <div>
      
    </div>
  )
}

export default Community