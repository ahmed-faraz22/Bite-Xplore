import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../assets/style/sidenav.css'
import { RxDashboard } from "react-icons/rx";
import { CiMemoPad } from "react-icons/ci";
import { FaShieldAlt, FaUsers, FaClipboardList, FaMoneyBillWave } from "react-icons/fa";

const AdminSidenav = () => {
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
                        <NavLink to="verification">
                            <FaShieldAlt /> Pending Verifications
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="categories">
                            <CiMemoPad /> Categories
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="restaurants">
                            <FaUsers /> Restaurants
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="orders">
                            <FaClipboardList /> All Orders
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="commission">
                            <FaMoneyBillWave /> Commission
                        </NavLink>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default AdminSidenav

