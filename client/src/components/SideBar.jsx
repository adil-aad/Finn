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

    const navItemClass = 'flex w-full cursor-pointer items-center gap-3 rounded-md border border-line bg-surface p-3 text-left transition hover:border-line-strong'

  return (
    <aside className={`relative z-40 flex h-screen w-72 shrink-0 flex-col border-r border-line bg-surface p-4 transition-transform duration-200 max-md:fixed max-md:left-0 max-md:top-0 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
        {/* logo */}
        <div className='px-1 py-2'>
            <img src={theme === 'dark' ? assets.logo_full: assets.logo_full_dark} alt="Finn"
            className='w-full max-w-32'/>
        </div>
        {/* New chat button*/}
        <button onClick={createNewChat} className='mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-accent-ink transition hover:opacity-90'>
            <span className='text-base leading-none'>+</span>New chat
        </button>

        {/* search conversations*/}
        <div className='mt-3 flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3 focus-within:border-line-strong'>
            <img src={assets.search_icon} className='w-4 opacity-50 dark:invert' alt="" />
            <input onChange={(e)=>setSearch(e.target.value)} value={search} type="text"
            placeholder='Search conversations' className='min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/70'/>
        </div>

        { /* Recent Chats*/}
        {chats.length > 0 && <p className='mt-5 px-1 text-xs font-medium text-ink-muted'>Recent</p>}
        <div className='mt-2 flex-1 space-y-1 overflow-y-auto pr-1 text-sm'>
            {
                chats.filter((chat)=>chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()):
                chat.name.toLowerCase().includes(search.toLowerCase())).map((chat)=>(
                    <div key={chat._id} className='group relative'>
                        <button onClick={()=>{navigate('/'); setSelectedChat(chat); setIsMenuOpen(false)}} className='w-full cursor-pointer rounded-md p-2.5 pr-10 text-left transition hover:bg-surface-muted'>
                            <p className='truncate text-ink'>{chat.messages.length > 0 ? chat.messages[0].content.slice(0,48): chat.name}</p>
                            <p className='mt-0.5 text-xs text-ink-muted'>{moment(chat.updatedAt).fromNow()}</p>
                        </button>
                        <button onClick={e=> deleteChat(e, chat._id)} className='absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-md opacity-0 transition hover:bg-line focus-visible:opacity-100 group-hover:opacity-100' aria-label='Delete chat'>
                            <img src={assets.bin_icon} alt="" className='w-3.5 dark:invert'/>
                        </button>
                    </div>
                ))
            }
        </div>
        {/* Community images*/}
        <button onClick={()=>{navigate('/community'); setIsMenuOpen(false)}} className={`mt-4 ${navItemClass}`}>
            <img src={assets.gallery_icon} alt="" className='w-4 opacity-70 dark:invert'/>
            <div className='flex flex-col text-sm'>
                <p className='font-medium text-ink'>Community images</p>
                <p className='text-xs text-ink-muted'>Browse shared generations</p>
            </div>
        </button>

         {/* Credit Purchase*/}
        <button onClick={()=>{navigate('/credits'); setIsMenuOpen(false)}} className={`mt-2 ${navItemClass}`}>
            <img src={assets.diamond_icon} alt="" className='w-4 opacity-70 dark:invert'/>
            <div className='flex flex-col text-sm'>
                <p className='font-medium text-ink'>Credits: {user?.credits}</p>
                <p className='text-xs text-ink-muted'>Top up your workspace</p>
            </div>
        </button>

        {/*Dark Toggle */}
        <div className='mt-2 flex items-center justify-between gap-2 rounded-md border border-line bg-surface p-3'>
            <div className='flex items-center gap-3 text-sm'>
                <img src={assets.theme_icon} alt="" className='w-4 opacity-70 dark:invert'/>
                <p className='font-medium text-ink'>Dark mode</p>
            </div>
            <label className='relative inline-flex cursor-pointer'>
                <input onChange={()=>setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox"
                className='sr-only peer' checked={theme === 'dark'}/>
                <div className='h-5 w-9 rounded-full bg-line-strong transition-colors peer-checked:bg-accent'>

                </div>
                <span className='absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-surface transition-transform peer-checked:translate-x-4'>

                </span>
            </label>
        </div>

        {/*user account */}
        <div className='mt-2 flex items-center gap-3 rounded-md border border-line bg-surface-muted p-3'>
            <img src={assets.user_icon} alt="" className='w-8 rounded-full bg-surface p-1'/>
            <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium text-ink'>{user ? user.name : 'Login to your account'}</p>
                <p className='truncate text-xs text-ink-muted'>{user?.email || 'Guest session'}</p>
            </div>
            {user && <button onClick={logOut} className='grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-md opacity-60 transition hover:bg-line hover:opacity-100' aria-label='Log out'>
                <img src={assets.logout_icon} className='h-4 dark:invert' alt=''/>
            </button>}

        </div>

        <button onClick={()=>setIsMenuOpen(false)} className='absolute right-3 top-3 grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-line bg-surface md:hidden' aria-label='Close menu'>
            <img src={assets.close_icon} alt="" className='h-3.5 w-3.5 dark:invert'/>
        </button>

    </aside>
  )
}

export default SideBar
