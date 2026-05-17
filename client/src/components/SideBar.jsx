import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'

const SideBar = ({isMenuOpen, setIsMenuOpen}) => {

    const {chats, setSelectedChat, theme, setTheme, user, navigate,
        createNewChat, axios, setChats, fetchUsersChats, token,  setToken } = useAppContext()
    const [search, setSearch] = useState('')

    const logOut = () => {
        localStorage.removeItem('token')
        setToken(null)
        toast.success('Logged Out successfully')
    }

    const deleteChat = async(e, chatId) => {

        try {
            e.stopPropagation()
            const confirm = window.confirm('Are you sure you want to delete this chat?')

            if(!confirm) return
            const { data } = await axios.post ('/api/chat/delete', {chatId},
            {headers: {Authorization: token}})

            if(data.success){
                setChats(prev => prev.filter(chat => chat._id !== chatId))
                await fetchUsersChats()
                toast.success(data.message)
            }
                
        } catch (error) {
           toast.error(error.message)     
        }
        
    }

  return (
    <aside className={`relative z-40 flex h-screen w-80 shrink-0 flex-col border-r border-zinc-200/80 bg-white/85 p-4 shadow-2xl shadow-zinc-200/70 backdrop-blur-2xl transition-transform duration-300 max-md:fixed max-md:left-0 max-md:top-0 dark:border-white/10 dark:bg-zinc-950/82 dark:shadow-black/40 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
        {/* logo */}
        <div className='flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-[#faf8f1] p-3 dark:border-white/10 dark:bg-white/[0.04]'>
            <img src={theme === 'dark' ? assets.logo_full: assets.logo_full_dark} alt="Finn"
            className='w-full max-w-36'/>
            <span className='rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'>AI Studio</span>
        </div>
        {/* New chat button*/}
        <button onClick={createNewChat} className='mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-950 text-sm font-semibold text-white shadow-lg shadow-zinc-300/70 transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:shadow-black/30 dark:hover:bg-zinc-200'>
            <span className='grid h-6 w-6 place-items-center rounded-full bg-cyan-400 text-lg leading-none text-zinc-950'>+</span>New Chat
        </button>

        {/* search conversations*/}
        <div className='mt-4 flex h-11 items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]'>
            <img src={assets.search_icon} className='w-4 opacity-60 dark:invert' alt="" />
            <input onChange={(e)=>setSearch(e.target.value)} value={search} type="text"
            placeholder='Search conversations' className='min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400'/>
        </div>

        { /* Recent Chats*/}
        {chats.length > 0 && <p className='mt-5 px-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400'>Recent</p>}
        <div className='mt-3 flex-1 space-y-2 overflow-y-auto pr-1 text-sm'>
            {
                chats.filter((chat)=>chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()):
                chat.name.toLowerCase().includes(search.toLowerCase())).map((chat)=>(
                    <div onClick={()=>{navigate('/'); setSelectedChat(chat); setIsMenuOpen(false)}} key={chat._id} className='group flex cursor-pointer justify-between gap-3 rounded-lg border border-transparent p-3 transition hover:border-zinc-200 hover:bg-[#faf8f1] dark:hover:border-white/10 dark:hover:bg-white/[0.05]'>
                        <div className='min-w-0'>
                            <p className='w-full truncate font-medium'>{chat.messages.length > 0 ? chat.messages[0].content.slice(0,48): chat.name}</p>
                            <p className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>{moment(chat.updatedAt).fromNow()}</p>
                        </div>
                        <button onClick={e=> deleteChat(e, chat._id)} className='grid h-8 w-8 shrink-0 place-items-center rounded-full opacity-0 transition group-hover:opacity-100 hover:bg-rose-100 dark:hover:bg-rose-400/10' aria-label='Delete chat'>
                            <img src={assets.bin_icon} alt="" className='w-4 dark:invert'/>
                        </button>
                    </div>
                ))
            }
        </div>
        {/* Community images*/}
        <div onClick={()=>{navigate('/community'); setIsMenuOpen(false)}} className='mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-400/50'>
            <img src={assets.gallery_icon} alt="" className='w-5 dark:invert'/>
            <div className='flex flex-col text-sm'>
                <p className='font-semibold'>Community Images</p>
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>Browse shared generations</p>
            </div>
        </div>

         {/* Credit Purchase*/}
        <div onClick={()=>{navigate('/credits'); setIsMenuOpen(false)}} className='mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-lime-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-lime-400/50'>
            <img src={assets.diamond_icon} alt="" className='w-5 dark:invert'/>
            <div className='flex flex-col text-sm'>
                <p className='font-semibold'>Credits: {user?.credits}</p>
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>Top up your workspace</p>
            </div>
        </div>

        {/*Dark Toggle */}
        <div className='mt-3 flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]'>
            <div className='flex items-center gap-2 text-sm'>
                <img src={assets.theme_icon} alt="" className='w-4 dark:invert'/>
                <p className='font-medium'>Dark Mode</p>
            </div>
            <label className='relative inline-flex cursor-pointer'>
                <input onChange={()=>setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox"
                className='sr-only peer' checked={theme === 'dark'}/>
                <div className='h-6 w-11 rounded-full bg-zinc-300 transition-all peer-checked:bg-cyan-400'>

                </div>
                <span className='absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5'>

                </span>
            </label>
        </div>

        {/*user account */}
        <div className='group mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-[#faf8f1] p-3 dark:border-white/10 dark:bg-white/[0.04]'>
            <img src={assets.user_icon} alt="" className='w-9 rounded-full bg-white p-1'/>
            <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold'>{user ? user.name : 'Login to your account'}</p>
                <p className='truncate text-xs text-zinc-500 dark:text-zinc-400'>{user?.email || 'Guest session'}</p>
            </div>
            {user && <button onClick={logOut} className='grid h-9 w-9 place-items-center rounded-full opacity-70 transition hover:bg-zinc-200 hover:opacity-100 dark:hover:bg-white/10' aria-label='Log out'>
                <img src={assets.logout_icon} className='h-5 dark:invert' alt=''/>
            </button>}
            
        </div>

        <button onClick={()=>setIsMenuOpen(false)} className='absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white md:hidden dark:border-white/10 dark:bg-zinc-900' aria-label='Close menu'>
            <img src={assets.close_icon} alt="" className='h-4 w-4 dark:invert'/>
        </button>

    </aside>
  )
}

export default SideBar
