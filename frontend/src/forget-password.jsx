import "./forget-password.css"
import { Link } from "react-router-dom"
function ForgetPasswd(){
    return(
        <>
       <div className="reset-container">
  <form className="reset-card">
    <h2>Reset Password</h2>
    <p>Enter Your Registered Email To Reset Your Password</p>

    <input
      type="email"
      placeholder="Enter Your Registered Email"
      required
    />
    {/* remaing fuctionality for disabling the button while sending the link will be implemented later */}
    <button type="submit">
      Send Password Reset Link
    </button>
    <Link to="/" className="login-link">Back To Login</Link>
  </form>
</div>
</>
    )
}

export { ForgetPasswd }