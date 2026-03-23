import { Link } from "react-router-dom"
import { FaHome, FaShoppingCart, FaRegUser } from "react-icons/fa"
import { AiFillProduct } from "react-icons/ai"
function Navbar(){
    return(
        <>
       <nav>
        <Link to="/"><FaHome />Home</Link>
        <Link to="/products"><AiFillProduct />Products</Link>
        <Link to="/cart"><FaShoppingCart />My Cart</Link>
        <Link to="/profile"><FaRegUser /></Link>
       </nav>
        </>
    )
}

export default Navbar