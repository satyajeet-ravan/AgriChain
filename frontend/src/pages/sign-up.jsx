import PhoneInput from "react-phone-number-input"
import "./sign-up.css"
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Farmer from "../assets/Farmer.jpg"
import Buyer from "../assets/buyer.jpg"

function Signup() {
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setComfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [selected, setSelected] = useState("")
    const navigation = useNavigate()
    return (
        <>
            <div className="sign-up-container">
                <form action="" className="sign-up-card">
                    <h2>Create Your Account</h2>
                    <input type="text" name="Name" placeholder="Enter Your Name" required />
                    <input type="email" name="Email" placeholder="Enter Your Email" />
                    <PhoneInput defaultCountry="IN" value={phone} onChange={setPhone} placeholder="Enter Your Phone Number" />
                    <h4>Select Login Type: </h4>
                    <div className="login-type">
                    <button type="select" onClick={() => setSelected("farmer")} disabled={selected == "buyer"}><img src={Farmer} alt="Farmer-signin-button" /> Farmer/Seller </button>
                    <button type="select" onClick={() => setSelected("buyer")} disabled={selected == "farmer"}><img src={Buyer} alt="buyer-signin-button" /> Customer/Buyer </button>
                    </div>
                    <div className="password-wrapper">
                        <input type={showPassword ? "text" : "password"}
                            name="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>


                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="Confirm-Password"
                            value={confirmPassword}
                            onChange={(e) => setComfirmPassword(e.target.value)}
                            placeholder="Retype Your Password"
                            required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {password && confirmPassword &&
                        password !== confirmPassword && (
                            <p style={{ color: "#D32F2F" }}>
                                Passwords do not match
                            </p>
                        )}
                    <button type="submit" disabled={password != confirmPassword} onClick={() => navigation("/")}>Sign Up</button>
                </form>
            </div>
        </>
    )
}

export { Signup }