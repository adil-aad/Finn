import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Loading = () => {

  const navigate = useNavigate()
  const {fetchUser} = useAppContext()

  useEffect(()=>{
    const timeout = setTimeout(()=>{
      fetchUser()
      navigate('/')
    }, 8000)
    return ()=> clearTimeout(timeout)
  },[])
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-canvas text-ink'>
      <div className='flex flex-col items-center gap-3'>
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-line-strong border-t-ink'></div>
        <p className='text-sm text-ink-muted'>Loading</p>
      </div>
    </div>
  )
}

export default Loading
