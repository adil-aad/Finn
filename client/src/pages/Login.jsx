import React, { useState } from 'react'

const Login = () => {
  const [state, setState] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    console.log("Login:", { email, password })
    // Add API call here
  }

  const handleSignup = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    console.log("Signup:", { name, email, password })
    // Add API call here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
            <h1 className="text-3xl font-bold text-white text-center">
              {state === "login" ? "Welcome Back" : "Join Us"}
            </h1>
            <p className="text-indigo-100 text-center mt-2">
              {state === "login" ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            {state === "login" ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-indigo-500 hover:text-indigo-600">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition mt-6"
                >
                  Sign In
                </button>
              </form>
            ) : (
              // Signup Form
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                <label className="flex items-center text-sm">
                  <input type="checkbox" required className="mr-2" />
                  <span className="text-gray-600">
                    I agree to the <a href="#" className="text-indigo-500 hover:text-indigo-600">Terms & Conditions</a>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition mt-6"
                >
                  Create Account
                </button>
              </form>
            )}

            {/* Toggle State */}
            <div className="mt-6 text-center border-t pt-6">
              <p className="text-gray-600 text-sm">
                {state === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setState(state === "login" ? "signup" : "login")
                    setEmail("")
                    setPassword("")
                    setName("")
                    setConfirmPassword("")
                  }}
                  className="text-indigo-500 font-semibold hover:text-indigo-600 transition"
                >
                  {state === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Social Login */}
            <div className="mt-6 space-y-2">
              <p className="text-center text-gray-600 text-sm">Or continue with</p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  Google
                </button>
                <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login