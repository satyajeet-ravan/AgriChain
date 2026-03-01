import PhoneInput from "react-phone-number-input"
import "./sign-up.css"
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"


function Signup() {
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setComfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    return (
        <>
            <div className="sign-up-container">
                <form action="" className="sign-up-card">
                    <h2>Create Your Account</h2>
                    <input type="text" name="Name" placeholder="Enter Your Name" required />
                    <input type="email" name="Email" placeholder="Enter Your Email" required />
                    <PhoneInput defaultCountry="IN" value={phone} onChange={setPhone} placeholder="Enter Your Phone Number" />
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
                    <button type="submit" disabled={password != confirmPassword}>Sign Up</button>
                </form>
            </div>
        </>
    )
}

export { Signup }