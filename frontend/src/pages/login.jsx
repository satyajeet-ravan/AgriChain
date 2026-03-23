import { Link } from "react-router-dom"
import "./login.css"
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

function Login(){
    const [showPassword, setShowPassword] = useState(false)
    return(
        <>
        <div className="login-container">
            <form action="" className="login-card">
                <h2>Login To Your Account</h2>
        <input type="email" name="Email" id="email" placeholder="Enter Your Email" required/>
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
        <button type="submit">Login</button>
        </form>
        </div>
        </>
        
    )
}

export { Login }