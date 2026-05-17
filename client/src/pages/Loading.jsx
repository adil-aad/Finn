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
    <div className='flex h-screen w-screen items-center justify-center bg-[#f6f4ef] text-zinc-950 dark:bg-[#101113] dark:text-white'>
      <div className='flex flex-col items-center gap-4'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-cyan-400 dark:border-white/10 dark:border-t-cyan-300'></div>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400'>Loading Finn</p>
      </div>
    </div>
  )
}

export default Loading
