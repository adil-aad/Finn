import React, { useEffect, useState } from 'react'
import { dummyPublishedImages } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Community = () => {

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  const {axios} = useAppContext()
  

  const fetchImages = async () => {
    try {
      const {data} = await axios.get('/api/user/published-images')
      if(data.success){
        setImages(data.images)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

    setLoading(false)
  }

  useEffect(()=>{
    fetchImages()
  },[])

  if(loading) return <Loading />

  return (
    <section className='relative z-10 h-full w-full overflow-y-auto px-4 pb-10 pt-16 md:px-8 md:pt-8 xl:px-12'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-ink'>Community images</h2>
          <p className='mt-1 text-sm text-ink-muted'>Images published from Finn conversations.</p>
        </div>

      {images.length > 0 ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          {images.map((item, index)=>(
            <a key={index} href={item.imageUrl} target='_blank' rel='noreferrer' className='block overflow-hidden rounded-lg border border-line bg-surface transition hover:border-line-strong'>
              <img src={item.imageUrl} alt="" className='aspect-[4/3] w-full object-cover'/>
              <p className='truncate border-t border-line px-3 py-2 text-xs text-ink-muted'>Created by {item.userName}</p>
            </a>
          ))}
        </div>
      ): (
        <div className='rounded-lg border border-line bg-surface p-10 text-center'>
          <p className='text-sm text-ink-muted'>No images published yet.</p>
        </div>
      )}
      </div>
    </section>
  )
}

export default Community
