import { Link, useNavigate } from "react-router-dom"
import "./login.css"
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import PhoneInput from "react-phone-number-input"

function Login(){
    const [showPassword, setShowPassword] = useState(false)
    const navigation = useNavigate()
    const [phone, setPhone] = useState("")
    return(
        <>
        <div className="login-container">
            <form action="" className="login-card">
                <h2>Login To Your Account</h2>
        <PhoneInput defaultCountry="IN" value={phone} onChange={setPhone} placeholder="Enter Your Phone Number" />
        <div className="password-wrapper">
        <input type={ showPassword ? "text" : "password" }
         name="Password" 
         id="password"
         placeholder="Enter Password" required/>
         <button type="button" onClick={() => setShowPassword(!showPassword)}>
            { showPassword ? <FaEyeSlash /> : <FaEye />}
         </button>
        </div>
        <Link to="/forget-password" className="fgtpasswd">Forget Password</Link>
        <p>Don't Have an Account? <Link to="/sign-up">Sign Up</Link></p>
        <button type="submit" onClick={() => navigation("/")}>Login</button>
        </form>
        </div>
        </>
        
    )
}

export { Login }