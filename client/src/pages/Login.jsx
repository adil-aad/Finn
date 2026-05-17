import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Login = () => {

  const [state, setState] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {axios, setToken} = useAppContext() 

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = state === "login" ? '/api/user/login' : '/api/user/register'


    try {
      const {data} = await axios.post(url, {name, email, password})
      if(data.success){
        setToken(data.token)
        localStorage.setItem('token', data.token)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
  return (
    <main className='grid min-h-screen place-items-center px-4 py-10'>
    <div className='grid w-full max-w-5xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/80 md:grid-cols-[1.05fr_0.95fr] dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/30'>
      <section className='hidden bg-zinc-950 p-8 text-white md:flex md:flex-col md:justify-between'>
        <div>
          <p className='text-sm font-bold uppercase tracking-[0.2em] text-cyan-300'>Finn</p>
          <h1 className='mt-5 max-w-sm text-5xl font-semibold leading-tight tracking-tight'>Your focused AI workspace.</h1>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div className='rounded-lg border border-white/10 bg-white/[0.06] p-4'>
            <p className='text-3xl font-semibold'>20</p>
            <p className='mt-1 text-sm text-white/60'>starter credits</p>
          </div>
          <div className='rounded-lg border border-white/10 bg-white/[0.06] p-4'>
            <p className='text-3xl font-semibold'>Text + Image</p>
            <p className='mt-1 text-sm text-white/60'>one clean flow</p>
          </div>
        </div>
      </section>

    <form onSubmit={handleSubmit} className='flex w-full flex-col gap-4 p-6 py-8 text-zinc-600 sm:p-10 dark:text-zinc-300'>
      <div className='mb-2'>
        <p className='text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300'>{state === "login" ? "Welcome back" : "Create workspace"}</p>
        <h2 className='mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white'>
          {state === "login" ? "Log in to Finn" : "Start using Finn"}
        </h2>
      </div>

      {state === "register" && (
        <div className='w-full'>
          <p className='text-sm font-medium'>Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} placeholder='type here'
          className='mt-2 h-12 w-full rounded-md border border-zinc-200 bg-[#faf8f1] px-3 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-white/[0.05]' type='text' required/>
        </div>
      )}

      <div className='w-full'>
        <p className='text-sm font-medium'>Email</p>
        <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder='type here'
        className='mt-2 h-12 w-full rounded-md border border-zinc-200 bg-[#faf8f1] px-3 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-white/[0.05]' type='email' required/>
      </div>

      <div className='w-full'>
        <p className='text-sm font-medium'>Password</p>
        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder='type here'
        className='mt-2 h-12 w-full rounded-md border border-zinc-200 bg-[#faf8f1] px-3 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-white/[0.05]' type='password' required/>
      </div>

      {state === "register" ? (
        <p className='text-sm'>
          Already have account? <span onClick={()=> setState("login")} className='cursor-pointer font-semibold text-cyan-700 dark:text-cyan-300'>Log in</span>
        </p>
      ): (
        <p className='text-sm'>
          Create an account? <span onClick={() => setState("register")} className='cursor-pointer font-semibold text-cyan-700 dark:text-cyan-300'>Sign up</span>
        </p>
      )}

      <button type='submit' className='mt-2 h-12 w-full cursor-pointer rounded-md bg-zinc-950 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200'>
        {state === "register" ? "Create Account" : "Login"}

      </button>
     
    </form>
    </div>
    </main>
  )
}

export default Login
