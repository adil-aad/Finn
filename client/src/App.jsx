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
      className: '!rounded-md !border !border-line !bg-surface !text-ink !text-sm !shadow-none'
    }} />
    {!isMenuOpen && <button className='fixed top-4 left-4 z-30 grid h-10 w-10 place-items-center rounded-md border border-line bg-surface md:hidden' onClick={()=>setIsMenuOpen(true)} aria-label='Open menu'>
      <img src={assets.menu_icon} className='h-5 w-5 dark:invert' alt=''/>
    </button>}

      {user ? (
        <div className='min-h-screen bg-canvas text-ink'>
        <div className='flex h-screen w-screen overflow-hidden'>
          <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
          <main className='relative flex min-w-0 flex-1 overflow-hidden'>
            <Routes>
              <Route path='/' element={<ChatBox/>}/>
              <Route path='/credits' element={<Credits/>}/>
              <Route path='/community' element={<Community/>}/>
            </Routes>
          </main>
        </div>
      </div>
      ): (
        <div className='min-h-screen w-screen bg-canvas text-ink'>
          <Login />
        </div>
      )}


      
    </>
  )
}

export default App
