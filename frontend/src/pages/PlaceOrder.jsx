import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [method, setMethod] = useState('cod');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    block: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } })
          if(data.success) {
            navigate('/orders');
            setCartItems({})
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];

      for(const items in cartItems) {
        for(const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items))
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo)
            }
          }
        }
      }
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch(method) {

        // MARK: api call for cod
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token }})
          if (response.data.success) {
            setCartItems({});
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
        break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token }})
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
        break;

        case 'razorpay':
          const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token }})
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          } else {
            toast.error(responseStripe.data.message)
          }
        break;

        default:
          break;
      }

    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <form onSubmit={ onSubmitHandler } className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input onChange={ onChangeHandler } name='firstName' value={ formData.firstName } placeholder='First Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" required />
          <input onChange={ onChangeHandler } name='lastName' value={ formData.lastName } placeholder='Last Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" required />
        </div>
        <input onChange={ onChangeHandler } name='email' value={ formData.email } placeholder='Email Address' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" required />
        <div className='flex gap-3'>
          <input onChange={ onChangeHandler } name='block' value={ formData.block } placeholder='House/Block No.' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" required />
          <input onChange={ onChangeHandler } name='street' value={ formData.street } placeholder='Street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" required />
          </div>
        <div className='flex gap-3'>
          <input onChange={ onChangeHandler } name='city' value={ formData.city } placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" required />
          <input onChange={ onChangeHandler } name='state' value={ formData.state } placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" required />
        </div>
        <div className='flex gap-3'>
          <input onChange={ onChangeHandler } name='zipcode' value={ formData.zipcode } placeholder='Zipcode' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" required />
          <input onChange={ onChangeHandler } name='country' value={ formData.country } placeholder='Country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" required />
        </div>
        <input onChange={ onChangeHandler } name='phone' value={ formData.phone } placeholder='Phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" required />
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          {/* Payment Method Selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            {/* <div onClick={ () => setMethod('stripe') } className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${ method === 'stripe' ? 'bg-green-400' : '' }`}></p>
              <img className='h-5 mx-4' src={ assets.stripe_logo } alt="" />
            </div> */}
            <div onClick={ () => setMethod('razorpay') } className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${ method === 'razorpay' ? 'bg-green-400' : '' }`}></p>
              <img className='h-5 mx-4' src={ assets.razorpay_logo } alt="" />
            </div>
            <div onClick={ () => setMethod('cod') } className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${ method === 'cod' ? 'bg-green-400' : '' }`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-10 py-3 text-sm'>Place Order</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
