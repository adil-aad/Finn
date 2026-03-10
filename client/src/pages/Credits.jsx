import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = async (params) => {
    setPlans(dummyPlans)
    setLoading(false)
  }

  useEffect(()=>{
    fetchPlans()
  },[])

  if(loading) return <Loading />
  return (
    <div>
      
    </div>
  )
}

export default Credits