import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');

  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(token) {
      toast.success("Logged In Successfully");
      setTimeout(() => {
        navigate('/');
      }, 2000)
    }
  }, [token])

  return (
    <form onSubmit={ onSubmitHandler } className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{ currentState }</p>
        <hr className='border-none h-[1.9px] w-8 bg-gray-800' />
      </div>
      { 
        currentState === 'Sign Up' 
        && 
        <input onChange={ (e) => setName(e.target.value) } className='w-full px-3 py-2 border border-gray-800' type="text" placeholder='Name' required /> 
      }
      <input onChange={ (e) => setEmail(e.target.value) } className='w-full px-3 py-2 border border-gray-800' type="email" placeholder='Email' required />
      <input onChange={ (e) => setPassword(e.target.value) } className='w-full px-3 py-2 border border-gray-800' type="password" placeholder='Password' required />

      <div className='w-full flex justify-center text-sm mt-[-8px]'>
        {
          currentState === "Login" 
          ? <p className='inline'>Don't have an Account <span onClick={ () => setCurrentState('Sign Up') } className='cursor-pointer inline text-blue-800'> Create Now</span></p>
          : <p className='inline'>Already have an Account <span onClick={ () => setCurrentState('Login') } className='cursor-pointer inline text-blue-800'> Login</span></p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-1'>{ currentState === 'Login' ? 'Sign In' : 'Sign Up' }</button>
    </form>
  )
}

export default Login
