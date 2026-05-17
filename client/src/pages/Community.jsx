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
    <section className='relative z-10 h-full w-full overflow-y-auto px-4 pb-10 pt-16 md:px-8 md:pt-8 xl:px-14'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8 flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end dark:border-white/10'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300'>Gallery</p>
            <h2 className='mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white'>Community Images</h2>
          </div>
          <p className='max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400'>A live board of images published from Finn conversations.</p>
        </div>

      {images.length > 0 ? (
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          {images.map((item, index)=>(
            <a key={index} href={item.imageUrl} target='_blank' className='group relative block aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg shadow-zinc-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/25'>
              <img src={item.imageUrl} alt="" className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'/>
              <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12'>
                <p className='inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur'>Created by {item.userName}</p>
              </div>
            </a>
          ))}
        </div>
      ): (
        <div className='rounded-lg border border-dashed border-zinc-300 bg-white/60 p-10 text-center dark:border-white/15 dark:bg-white/[0.03]'>
          <p className='text-zinc-600 dark:text-zinc-300'>No images published yet.</p>
        </div>
      )}
      </div>
    </section>
  )
}

export default Community
