import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import Logo from '../components/Logo'
import toast from 'react-hot-toast'

const Login = () => {

  const [state, setState] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const {axios, setToken} = useAppContext()

  const isRegister = state === "register"

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(submitting) return

    const url = isRegister ? '/api/user/register' : '/api/user/login'

    setSubmitting(true)
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
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass = 'mt-1.5 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus:border-line-strong focus:ring-2 focus:ring-ink/10'

  return (
    <main className='grid min-h-screen place-items-center px-4 py-10'>
      <div className='w-full max-w-sm'>
        <form onSubmit={handleSubmit} className='rounded-lg border border-line bg-surface p-6 sm:p-8'>
          <Logo className='text-ink' markClass='h-8 w-8' textClass='text-lg'/>
          <p className='mt-3 text-sm text-ink-muted'>
            {isRegister ? 'Create an account to get started.' : 'Log in to your account.'}
          </p>

          <div className='mt-6 flex flex-col gap-4'>
            {isRegister && (
              <div>
                <label htmlFor='name' className='text-sm font-medium text-ink'>Name</label>
                <input id='name' onChange={(e) => setName(e.target.value)} value={name}
                autoComplete='name' className={fieldClass} type='text' required/>
              </div>
            )}

            <div>
              <label htmlFor='email' className='text-sm font-medium text-ink'>Email</label>
              <input id='email' onChange={(e) => setEmail(e.target.value)} value={email}
              autoComplete='email' className={fieldClass} type='email' required/>
            </div>

            <div>
              <label htmlFor='password' className='text-sm font-medium text-ink'>Password</label>
              <input id='password' onChange={(e) => setPassword(e.target.value)} value={password}
              autoComplete={isRegister ? 'new-password' : 'current-password'} className={fieldClass} type='password' required/>
            </div>
          </div>

          <button type='submit' disabled={submitting}
          className='mt-6 h-11 w-full cursor-pointer rounded-md bg-accent text-sm font-medium text-accent-ink transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60'>
            {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className='mt-4 text-center text-sm text-ink-muted'>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type='button' onClick={() => setState(isRegister ? "login" : "register")}
          className='cursor-pointer font-medium text-ink underline underline-offset-4 hover:no-underline'>
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </main>
  )
}

export default Login
