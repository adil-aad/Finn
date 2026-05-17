import React, { useState } from 'react'
import SideBar from './components/SideBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'

const App = () => {

  const {user, loadingUser} = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname} = useLocation()

  if(pathname === '/loading' || loadingUser) return <Loading />

  return (
    <>
    <Toaster toastOptions={{
      className: 'dark:!bg-zinc-900 dark:!text-white',
      style: { borderRadius: '14px' }
    }} />
    {!isMenuOpen && <button className='fixed top-4 left-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-zinc-200 bg-white/90 shadow-lg shadow-zinc-200/60 backdrop-blur md:hidden dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-black/30' onClick={()=>setIsMenuOpen(true)} aria-label='Open menu'>
      <img src={assets.menu_icon} className='h-5 w-5 dark:invert' alt=''/>
    </button>}

      {user ? (
        <div className='min-h-screen bg-[#f6f4ef] text-zinc-950 dark:bg-[#101113] dark:text-zinc-50'>
        <div className='flex h-screen w-screen overflow-hidden'>
          <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
          <main className='relative flex min-w-0 flex-1 overflow-hidden'>
            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.08),transparent_34%)]' />
            <Routes>
              <Route path='/' element={<ChatBox/>}/>
              <Route path='/credits' element={<Credits/>}/>
              <Route path='/community' element={<Community/>}/>
            </Routes>
          </main>
        </div>
      </div>
      ): (
        <div className='min-h-screen w-screen bg-[#f6f4ef] text-zinc-950 dark:bg-[#101113] dark:text-zinc-50'>
          <Login />
        </div>
      )}


      
    </>
  )
}

export default App
