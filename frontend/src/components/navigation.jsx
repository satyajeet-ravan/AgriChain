import { Link } from "react-router-dom";
import { FaHome, FaShoppingCart, FaRegUser } from "react-icons/fa";
import { CiShop } from "react-icons/ci";
import "./navigation.css";

function Navbar() {
  return (
    <div className="navbar">
        <div className="hero-section">
      <h1>AgriChain</h1>
      <h4>Fresh from Farms, Straight to You.</h4>
      </div>

      <nav className="navigation">
        <Link className="nav-link" to="/"><FaHome /> Home</Link>
        <Link className="nav-link" to="/products"><CiShop /> Marketplace </Link>
        <Link className="nav-link" to="/cart"><FaShoppingCart /> My Cart</Link>
        <Link className="nav-link" to="/profile"><FaRegUser /></Link>
      </nav>
    </div>
  );
}

export default Navbar;