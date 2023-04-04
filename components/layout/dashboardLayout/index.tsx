import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '@/repository/firebase'

import Sidebar from '@/components/sidebar'

import styles from './dashboardLayout.module.scss'

import { IDashboardLayoutProps } from './dashboardLayout.types'

const DashboardLayout: React.FC<IDashboardLayoutProps> = ({ children }) => {

    const [user] = useAuthState(auth)
    const router = useRouter()
    const navigateTo = () => {
        router.push('/')
    }
    useEffect(() => {
        !user ? navigateTo() : null
    }, [])
    return (<div className={styles['container']}>
        <div className={styles['sidebar']}>
            <Sidebar />
        </div>
        <div className={styles['main']}>
            {
                children
            }
        </div>
    </div>)
}

export default DashboardLayout