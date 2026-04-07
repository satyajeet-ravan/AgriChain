import { useState } from "react";
import { Popover } from "@headlessui/react"
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoFilter } from "react-icons/io5";
import "./categories.css"
function Categories() {
    const [categories, setCategories] = useState([])
    const [filters, setFilters] = useState([])

    const handleChange = (cat) => {
        setCategories(prev => prev.includes(cat)
            ? prev.filter(c => c !== cat)
            : [...prev, cat]);
    };

    const handlefilter = (cat) => {
        setFilters(prev => prev.includes(cat)
            ? prev.filter(c => c !== cat)
            : [...prev, cat]);
    };

    const categoryList = ["Fruits", "Vegetable", "Grains"];
    const Filters = ["Price(high-low)", "Price(low-high)", "Fresh", "Nearby"];
    return (
        <>
            <div className="container">
                <Popover className="popover">
                    <Popover.Button className="btn">
                        Shop By Categories <RiArrowDropDownLine />
                    </Popover.Button>

                    <Popover.Panel className="popover-panel">
                        <div className="list">
                            {categoryList.map(cat => (
                                <label key={cat}>
                                    <input
                                        type="checkbox"
                                        checked={categories.includes(cat)}
                                        onChange={() => handleChange(cat)}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </Popover.Panel>
                </Popover>

                <Popover className="popover">
                    <Popover.Button className="btn">
                       <IoFilter /> Apply Filters <RiArrowDropDownLine />
                    </Popover.Button>

                    <Popover.Panel className="popover-panel">
                        <div className="list">
                            {Filters.map(cat => (
                                <label key={cat}>
                                    <input
                                        type="checkbox"
                                        checked={filters.includes(cat)}
                                        onChange={() => handlefilter(cat)}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </Popover.Panel>
                </Popover>
            </div>
        </>
    )
}

export default Categories