import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/login'
import { Signup } from './pages/sign-up'
import { ForgetPasswd } from './forget-password'

function App() {
  return(
    <>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/sign-up' element={<Signup />} />
      <Route path='/forget-password' element={<ForgetPasswd />} />
      <Route path='*' element={<h1>Error 404 Page Not Found</h1>} />
    </Routes>
    </>
  )
}

export default App
