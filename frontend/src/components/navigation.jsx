import { Link } from "react-router-dom"
import { FaHome, FaShoppingCart, FaRegUser } from "react-icons/fa"
import { AiFillProduct } from "react-icons/ai"
import "./navigation.css"
function Navbar(){
    return(
        <>
       <nav>
        <Link className="nav-link" to="/"><FaHome />Home</Link>
        <Link className="nav-link" to="/products"><AiFillProduct />Products</Link>
        <Link className="nav-link" to="/cart"><FaShoppingCart />My Cart</Link>
        <Link className="nav-link" to="/profile"><FaRegUser /></Link>
       </nav>
        </>
    )
}

export default Navbar