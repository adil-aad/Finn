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
    <section className='relative z-10 h-full w-full overflow-y-auto px-4 pb-10 pt-16 md:px-8 md:pt-8 xl:px-12'>
      <div className='mx-auto max-w-5xl'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-ink'>Choose a plan</h2>
        <p className='mt-1 text-sm text-ink-muted'>Add generation credits for text and image workflows.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {plans.map((plan)=>(
          <div key={plan._id} className={`flex flex-col rounded-lg border bg-surface p-5 ${plan._id === 'pro' ? 'border-line-strong' : 'border-line'}`}>
            <div className='flex-1'>
              <div className='flex items-center justify-between gap-2'>
                <h3 className='text-sm font-medium text-ink'>{plan.name}</h3>
                {plan._id === 'pro' && <span className='text-xs text-ink-muted'>Most popular</span>}
              </div>
              <p className='mt-3 text-2xl font-semibold text-ink'>${plan.price}
                <span className='text-sm font-normal text-ink-muted'>{' '}/ {plan.credits} credits</span>
              </p>
              <ul className='mt-5 space-y-2.5 text-sm text-ink'>
                {plan.features.map((feature, index)=>(
                  <li key={index} className='flex gap-2.5'>
                    <span className='mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-muted'></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={()=> toast.promise(purchasePlan(plan._id), {loading: 'Processing'})} className={`mt-6 h-10 cursor-pointer rounded-md text-sm font-medium transition hover:opacity-90 ${plan._id === 'pro' ? 'bg-accent text-accent-ink' : 'border border-line-strong bg-surface text-ink hover:bg-surface-muted'}`}>Buy now</button>

          </div>
        ))}
      </div>
      </div>
    </section>
  )
}

export default Credits
