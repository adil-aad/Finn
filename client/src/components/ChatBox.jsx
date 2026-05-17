import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const ChatBox = () => {

    const containerRef = useRef(null)

    const {selectedChat, theme, user, axios, token, setUser} = useAppContext()

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    
    const [prompt, setPrompt] = useState('')
    const [mode, setMode] = useState('text')
    const [isPublished, setisPublished] = useState(false)

    const onSubmit = async (e) => {

        try {
            e.preventDefault()
            if(!user) return toast('Login to send message')
            setLoading(true)
            const promptCopy = prompt

            setPrompt('')
            setMessages(prev => [...prev, {role: 'user', content: prompt, timestamp: Date.now(), isImage: false}])

            const {data} = await axios.post(`/api/message/${mode}`, {chatId: selectedChat._id, 
            prompt, isPublished}, {headers: {Authorization: token}})

            if(data.success){
                setMessages(prev => [...prev, data.reply])

                // decrease credits 

                if(mode === 'image'){
                    setUser(prev => ({...prev, credits: prev.credits -2 }))
                }else {
                    setUser(prev => ({...prev, credits: prev.credits -1 }))
                }
            }else{
                toast.error(data.message)
                setPrompt(promptCopy)
            }

        } catch (error) {
            toast.error(error.message)
        }finally{
            setPrompt('')
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(selectedChat){
            setMessages(selectedChat.messages)
        }
    },[selectedChat])

    useEffect(()=>{
        if(containerRef.current){
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    },[messages])
  return (
    <section className='relative z-10 flex min-w-0 flex-1 flex-col px-4 pb-5 pt-16 md:px-8 md:pt-8 xl:px-14'>
        {/* chats*/}

        <div ref={containerRef} className='mx-auto mb-5 w-full max-w-5xl flex-1 overflow-y-auto rounded-lg border border-zinc-200/80 bg-white/74 p-4 shadow-xl shadow-zinc-200/50 backdrop-blur-xl md:p-6 dark:border-white/10 dark:bg-zinc-950/62 dark:shadow-black/25'>
            {messages.length === 0 && (
                <div className='flex h-full min-h-[420px] flex-col items-center justify-center gap-5 text-center'>
                    <img src={theme === 'dark' ? assets.logo_full: assets.logo_full_dark} alt="" 
                    className='w-full max-w-52 sm:max-w-64'/>
                    <div>
                        <p className='text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl dark:text-white'>Ask Away</p>
                        <p className='mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400'>Draft, explore, code, or generate images from a single focused workspace.</p>
                    </div>
                    <div className='grid w-full max-w-2xl gap-3 text-left sm:grid-cols-3'>
                        {['Write a launch plan', 'Create an image prompt', 'Explain this code'].map((item)=>(
                            <button key={item} onClick={()=>setPrompt(item)} className='rounded-lg border border-zinc-200 bg-[#faf8f1] p-3 text-sm font-medium transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-400/50'>{item}</button>
                        ))}
                    </div>
                </div>
            )}

            {messages.length > 0 && (
                <div className='mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-white/10'>
                    <div>
                        <p className='text-xs font-bold uppercase tracking-[0.18em] text-zinc-400'>Conversation</p>
                        <h1 className='mt-1 truncate text-xl font-semibold'>{selectedChat?.name || 'New Chat'}</h1>
                    </div>
                    <span className='rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-800 dark:bg-lime-400/10 dark:text-lime-300'>{user?.credits ?? 0} credits</span>
                </div>
            )}

            {messages.map((message, index)=><Message key={index} message={message}/>)}

            {/*Loading animation */}

            {
                loading && 
                <div className='loader flex items-center gap-1.5'>
                    <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                    <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                    <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                </div>
            }

        </div>

        {mode === 'image' && (
            <label className='mx-auto mb-3 inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-zinc-950/80'>
                <p className='text-xs font-medium'>Publish image to community</p>
                <input type="checkbox" className='cursor-pointer' checked={isPublished}
                onChange={(e)=>setisPublished(e.target.checked)}/>
            </label>
        )}

        {/* prompt box*/}
        <form onSubmit={onSubmit} className='mx-auto flex w-full max-w-5xl items-center gap-3 rounded-lg border border-zinc-200 bg-white/90 p-2 pl-3 shadow-2xl shadow-zinc-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/86 dark:shadow-black/30'>
            <select onChange={(e)=>setMode(e.target.value)} value={mode} className='h-11 rounded-md border border-zinc-200 bg-[#faf8f1] px-3 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/[0.06]'>
                <option className='dark:bg-zinc-900' value="text">Text</option>
                <option className='dark:bg-zinc-900' value="image">Image</option>
            </select>
            <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} type="text" placeholder='Enter Your Prompt...'
            className='min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-zinc-400' required/>
            <button disabled={loading} className='grid h-11 w-11 shrink-0 place-items-center rounded-md bg-zinc-950 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:hover:bg-zinc-200' aria-label='Send prompt'>
                <img src={loading ? assets.stop_icon : assets.send_icon} alt=""
                className='w-6 cursor-pointer dark:invert'/>
            </button>
        </form>
    </section>
  )
}

export default ChatBox
