import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const {axios, token} = useAppContext()

  const fetchPlans = async (params) => {
    try {
      const {data} = await axios.get('/api/credit/plan',
      {headers: {Authorization: token}})

      if(data.success){
        setPlans(data.plans)
      }else{
        toast.error(data.message || 'can not fetch plans')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const purchasePlan = async (planId) => {
    try {
      const {data} = await axios.post('/api/credit/purchase', {planId}, {headers: {Authorization: token}})
      if(data.success){
        window.location.href = data.url
      }else { 
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    fetchPlans()
  },[])

  if(loading) return <Loading />
  return (
    <section className='relative z-10 h-full w-full overflow-y-auto px-4 pb-10 pt-16 md:px-8 md:pt-8 xl:px-14'>
      <div className='mx-auto max-w-6xl'>
      <div className='mb-8 text-center'>
        <p className='text-xs font-bold uppercase tracking-[0.2em] text-lime-700 dark:text-lime-300'>Credits</p>
        <h2 className='mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white'>Choose Your Plan</h2>
        <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>Add generation credits for text and image workflows.</p>
      </div>

      <div className='grid gap-5 md:grid-cols-3'>
        {plans.map((plan)=>(
          <div key={plan._id} className={`relative flex min-h-[360px] flex-col rounded-lg border p-6 shadow-lg transition duration-300 hover:-translate-y-1 ${plan._id === 'pro' ? "border-zinc-950 bg-zinc-950 text-white shadow-zinc-300/80 dark:border-cyan-300 dark:bg-cyan-300 dark:text-zinc-950 dark:shadow-black/20" : "border-zinc-200 bg-white text-zinc-950 shadow-zinc-200/60 dark:border-white/10 dark:bg-zinc-950/70 dark:text-white dark:shadow-black/20"}`}>
            {plan._id === 'pro' && <span className='absolute right-4 top-4 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-zinc-950 dark:text-cyan-200'>Popular</span>}

            <div className='flex-1'>
              <h3 className='mb-2 text-xl font-semibold'>{plan.name}</h3>
              <p className={`mb-5 text-4xl font-bold ${plan._id === 'pro' ? '' : 'text-zinc-950 dark:text-white'}`}>${plan.price}
                <span className={`text-base font-normal ${plan._id === 'pro' ? 'text-white/70 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'}`}>{' '}/ {plan.credits} credits</span>
              </p>
              <ul className='space-y-3 text-sm'>
                {plan.features.map((feature, index)=>(
                  <li key={index} className='flex gap-2'><span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-lime-400'></span><span>{feature}</span></li>
                ))}
              </ul>
            </div>
            <button onClick={()=> toast.promise(purchasePlan(plan._id), {loading: 'Processing'})} className={`mt-6 h-11 cursor-pointer rounded-md font-semibold transition ${plan._id === 'pro' ? 'bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-800' : 'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200'}`}>Buy Now</button>

          </div>
        ))}
      </div>
      </div>
    </section>
  )
}

export default Credits
