import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import Login from './components/Login'
import { useState } from 'react'
import './App.css'
import './variables.css'
import Footer from './components/Footer.jsx'
import './assets/fonts/fonts.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        {/* Шапка видна всегда */}
        <Header />
        {/*Контент меняется при переходе. Список путей, которые при переходе будут обновляться*/}
        <main style={{padding: '1rem'}}>
        <Routes>
            <Route path='/' element = {<Home />} />
            <Route path='/about' element = {<About />} />
            <Route path='/products' element = {<Products />} />
            <Route path='/products/:id' element = {<ProductDetail />} />
            <Route path='/login' element = {<Login />} />
            <Route path='/cart' element = {<Cart />} />
        </Routes>
        </main>
        <Footer />
    </BrowserRouter>
  )
}

export default App
