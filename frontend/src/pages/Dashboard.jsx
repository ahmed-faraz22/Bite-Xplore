import React from 'react'
import Sidenav from '../components/dashboard/Sidenav'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
    return (
        <section className='dashboard'>
            <div className="container">
                <div className="inner" style={{ display: 'flex' , minHeight: '100vh' }}>
                    {/* Sidebar */}
                    <Sidenav />

                    {/* Content area */}
                    <div className="dashboard-content" style={{ flex: 1, padding: '20px' }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Dashboard
