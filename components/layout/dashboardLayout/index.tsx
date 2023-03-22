import Sidebar from '@/components/sidebar'
import { auth } from '@/repository/firebase'
import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styles from './dashboardLayout.module.scss'

interface DashboardLayoutProps extends PropsWithChildren {

}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
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