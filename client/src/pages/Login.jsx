import React, { useState } from 'react'

const Login = () => {

  const [state, setState] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
  }
  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 m-auto items-start p-8
    py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white'>
      <p className='text-2xl font-medium m-auto'>
        <span className='text-indingo-500'>User</span> {state === "login" ? "Login" : "Sign Up"}
      </p>
      {state === "register" && (
        <div className='w-full'>
          <p>Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} placeholder='type here'
          className='border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500' type='text' required/>
        </div>
      )}

      
      
    </form>
  )
}

export default Login