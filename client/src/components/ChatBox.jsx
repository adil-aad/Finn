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
    <section className='relative z-10 flex min-w-0 flex-1 flex-col px-4 pb-5 pt-16 md:px-8 md:pt-8 xl:px-12'>
        {/* chats*/}

        <div ref={containerRef} className='mx-auto mb-4 w-full max-w-4xl flex-1 overflow-y-auto rounded-lg border border-line bg-surface p-4 md:p-6'>
            {messages.length === 0 && (
                <div className='flex h-full min-h-[420px] flex-col items-center justify-center gap-4 text-center'>
                    <img src={theme === 'dark' ? assets.logo_full: assets.logo_full_dark} alt=""
                    className='w-full max-w-40'/>
                    <div>
                        <p className='text-2xl font-semibold text-ink'>Ask away</p>
                        <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted'>Draft, explore, code, or generate images from a single workspace.</p>
                    </div>
                    <div className='mt-2 grid w-full max-w-xl gap-2 text-left sm:grid-cols-3'>
                        {['Write a launch plan', 'Create an image prompt', 'Explain this code'].map((item)=>(
                            <button key={item} onClick={()=>setPrompt(item)} className='cursor-pointer rounded-md border border-line bg-surface-muted p-3 text-sm text-ink transition hover:border-line-strong'>{item}</button>
                        ))}
                    </div>
                </div>
            )}

            {messages.length > 0 && (
                <div className='mb-5 flex items-center justify-between gap-4 border-b border-line pb-4'>
                    <h1 className='min-w-0 truncate text-sm font-medium text-ink'>{selectedChat?.name || 'New chat'}</h1>
                    <span className='shrink-0 text-xs text-ink-muted'>{user?.credits ?? 0} credits</span>
                </div>
            )}

            {messages.map((message, index)=><Message key={index} message={message}/>)}

            {/*Loading animation */}

            {
                loading &&
                <div className='loader flex items-center gap-1.5'>
                    <div className='w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce'></div>
                    <div className='w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce'></div>
                    <div className='w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce'></div>
                </div>
            }

        </div>

        {mode === 'image' && (
            <label className='mx-auto mb-3 inline-flex cursor-pointer items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-xs text-ink'>
                <input type="checkbox" className='cursor-pointer accent-ink' checked={isPublished}
                onChange={(e)=>setisPublished(e.target.checked)}/>
                Publish image to community
            </label>
        )}

        {/* prompt box*/}
        <form onSubmit={onSubmit} className='mx-auto flex w-full max-w-4xl items-center gap-2 rounded-lg border border-line bg-surface p-2 focus-within:border-line-strong'>
            <select onChange={(e)=>setMode(e.target.value)} value={mode} className='h-10 cursor-pointer rounded-md border border-line bg-surface-muted px-2 text-sm text-ink outline-none'>
                <option value="text">Text</option>
                <option value="image">Image</option>
            </select>
            <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} type="text" placeholder='Enter your prompt'
            className='min-w-0 flex-1 bg-transparent px-1 text-sm text-ink outline-none placeholder:text-ink-muted/70' required/>
            <button disabled={loading} className='grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-md bg-accent transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60' aria-label='Send prompt'>
                <img src={loading ? assets.stop_icon : assets.send_icon} alt=""
                className='w-5 dark:invert'/>
            </button>
        </form>
    </section>
  )
}

export default ChatBox
