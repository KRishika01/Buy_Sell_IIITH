import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Components/Signup'
import { Navbar } from './Components/Navbar'
import Login  from './Components/Login'
import { Home } from './Components/Home'
import Profile from './Components/Profile'
import Search_Items from './Components/Search_Items'
import Deliver_Items from './Components/Deliver_Items'
import Orders_History from './Components/Orders_History'
import My_Cart from './Components/My_cart'
import ItemDetail from './Components/ItemDetail'
import {Dashboard} from './Components/Dashboard'
import {Protection_by_token} from './Components/protected'
import Add_item from './Components/Add_item'
import ChatBot from './Components/ChatBot'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/dashboard" element={<Protection_by_token><Dashboard/></Protection_by_token>}></Route>
          <Route path="/profile" element={<Protection_by_token><Profile/></Protection_by_token>}></Route>
          <Route path="/search_items" element={<Protection_by_token><Search_Items/></Protection_by_token>}></Route>
          <Route path="item/:itemName" element={<Protection_by_token><ItemDetail/></Protection_by_token>}></Route>
          <Route path="/orders_history" element={<Protection_by_token><Orders_History/></Protection_by_token>}></Route>
          <Route path="/deliver_items" element={<Protection_by_token><Deliver_Items/></Protection_by_token>}></Route>
          <Route path="/my_cart" element={<Protection_by_token><My_Cart/></Protection_by_token>}></Route>
          <Route path="/additem" element={<Protection_by_token><Add_item/></Protection_by_token>}></Route>
          <Route path="/chatbot" element={<Protection_by_token><ChatBot/></Protection_by_token>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
