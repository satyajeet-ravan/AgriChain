import { IoSearchSharp } from "react-icons/io5";
import "./searchbar.css"
function Searchbar(){
    return (
        <>
        <input type="search" placeholder="Search Crops" className="search-bar"/> <button type="serach" className="searchbtn"><IoSearchSharp /></button>
        </>
    )
}

export default Searchbar