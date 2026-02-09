import React from 'react'
import Sidenav from '../components/dashboard/Sidenav'
import AdminSidenav from '../components/dashboard/AdminSidenav'
import CommissionAlert from '../components/dashboard/CommissionAlert'
import '../assets/style/Dashboard.css'
import { Outlet, useLocation } from 'react-router-dom'

const Dashboard = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    // Get user role from localStorage
    const getUser = () => {
        try {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    };
    
    const user = getUser();
    const showAdminNav = isAdminRoute || user?.role === "admin";

    return (
        <section className='dashboard'>
            <div className="container">
                <div className="inner" style={{ display: 'flex' , minHeight: '100vh' }}>
                    {/* Sidebar - Show admin nav for admin routes */}
                    {showAdminNav ? <AdminSidenav /> : <Sidenav />}

                    {/* Content area */}
                    <div className="dashboard-content" style={{ flex: 1, padding: '20px' }}>
                        {!showAdminNav && <CommissionAlert />}
                        <Outlet />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Dashboard
