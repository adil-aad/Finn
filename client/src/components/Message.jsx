import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({message}) => {

    useEffect(()=>{
        Prism.highlightAll()
    },[message.content])
  return (
    <div>
        {message.role === 'user' ? (
            <div className='my-5 flex items-start justify-end gap-3'>
                <div className='flex max-w-2xl flex-col gap-2 rounded-lg bg-zinc-950 px-4 py-3 text-white shadow-lg shadow-zinc-200/70 dark:bg-white dark:text-zinc-950 dark:shadow-black/20'>
                    <p className='text-sm leading-6'>{message.content}</p>
                    <span className='text-xs text-white/55 dark:text-zinc-500'>{moment(message.timestamp).fromNow()}</span>

                </div>
                <img src={assets.user_icon} alt="" className='w-9 rounded-full bg-white p-1 shadow-sm'/>

            </div>
        ): 
        (
           <div className='my-5 inline-flex max-w-3xl flex-col gap-3 rounded-lg border border-zinc-200 bg-[#faf8f1] px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]'>
                {message.isImage ? (
                    <img src={message.content} className='mt-1 w-full max-w-xl rounded-lg border border-zinc-200 object-cover dark:border-white/10'/>
                ) : 
                (
                    <div className='reset-tw text-sm leading-6 text-zinc-800 dark:text-zinc-100'>
                    <Markdown>{message.content}</Markdown></div>
                )}
                <span className='text-xs text-zinc-500 dark:text-zinc-400'>{moment(message.timestamp).fromNow()}</span> 
           </div> 
        )
        }
    </div>
  )
}

export default Message
