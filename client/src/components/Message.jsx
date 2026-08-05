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
            <div className='my-4 flex items-start justify-end gap-3'>
                <div className='flex max-w-2xl flex-col gap-1.5 rounded-lg bg-accent px-4 py-3 text-accent-ink'>
                    <p className='text-sm leading-6'>{message.content}</p>
                    <span className='text-xs text-accent-ink/60'>{moment(message.timestamp).fromNow()}</span>

                </div>
                <img src={assets.user_icon} alt="" className='w-8 rounded-full bg-surface p-1'/>

            </div>
        ):
        (
           <div className='my-4 inline-flex max-w-3xl flex-col gap-2 rounded-lg border border-line bg-surface-muted px-4 py-3'>
                {message.isImage ? (
                    <img src={message.content} className='mt-1 w-full max-w-xl rounded-md border border-line object-cover'/>
                ) :
                (
                    <div className='reset-tw text-sm leading-6 text-ink'>
                    <Markdown>{message.content}</Markdown></div>
                )}
                <span className='text-xs text-ink-muted'>{moment(message.timestamp).fromNow()}</span>
           </div>
        )
        }
    </div>
  )
}

export default Message
