import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../assets/style/sidenav.css'
import { RxDashboard } from "react-icons/rx";
import { CiMemoPad } from "react-icons/ci";
import { FaListCheck, FaRegNewspaper } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { IoAddCircleOutline } from "react-icons/io5";

const Sidenav = () => {
    return (
        <aside className="sidenav">
            <div className="inner">
                <ul>
                    <li>
                        <NavLink to="." end>
                            <RxDashboard /> Dashboard
                        </NavLink>
                    </li>
                     <li>
                        <NavLink to="Profile">
                            <ImProfile /> Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="Profile">
                            <IoAddCircleOutline /> Add Product
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="categories">
                            <CiMemoPad /> Categories
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="Orders">
                            <FaListCheck /> Orders
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="Newsletter">
                            <FaRegNewspaper /> Newsletter
                        </NavLink>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default Sidenav
