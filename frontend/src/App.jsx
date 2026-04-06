import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/login'
import { Signup } from './pages/sign-up'
import { ForgetPasswd } from './pages/forget-password'
import Home from './pages/home'
import Product from './pages/porducts'
import Productdetail from './pages/product-detail'
import Orders from './pages/orders'

function App() {
  return (
    <>
      <Routes>

        {/*Public Route*/}
        <Route path='/' element={<Home />} />

        {/*Auth Route*/}
        <Route path='/login' element={<Login />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/forget-password' element={<ForgetPasswd />} />

        {/*Protected Routes*/}
        <Route path='/orders'
          element={<Orders />}
        />

        <Route path='/products'
          element={<Product />}
        />

        <Route path='/product-detail'
          element={<Productdetail />}
        />
        {/*Page not found route*/}
        <Route path='*' element={<h1>Error 404 Page Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
