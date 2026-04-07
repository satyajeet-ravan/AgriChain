import "./forget-password.css"
import { Link } from "react-router-dom"
import { useState } from "react"
import PhoneInput from "react-phone-number-input"
function ForgetPasswd(){
  const [phone, setPhone] = useState("")
    return(
        <>
       <div className="reset-container">
  <form className="reset-card">
    <h2>Reset Password</h2>
    <p>Enter Your Registered Mobile Number To Reset Your Password</p>
     <PhoneInput defaultCountry="IN" value={phone} onChange={setPhone} placeholder="Enter Your Phone Number" />
    {/* remaing fuctionality for disabling the button while sending the link will be implemented later */}
    <button type="submit">
      Send OTP
    </button>
    <Link to="/" className="login-link">Back To Login</Link>
  </form>
</div>
</>
    )
}

export { ForgetPasswd }