import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth, db, getUserFromStore } from '@/repository/firebase'

import Sidebar from '@/components/sidebar'

import styles from './dashboardLayout.module.scss'

import { IDashboardLayoutProps } from './dashboardLayout.types'
import { doc, setDoc } from 'firebase/firestore'

const DashboardLayout: React.FC<IDashboardLayoutProps> = ({ children }) => {

    const [user] = useAuthState(auth)
    const router = useRouter()
    const navigateTo = () => {
        router.push('/')
    }
    const handleUser = async () => {
        if (!user) { navigateTo() }
        if (user) {
            const res = await getUserFromStore(user.uid)
            if (!res) {
                const nameArray = user.displayName?.split(' ')
                if (nameArray) {
                    let firstName = nameArray[0]
                    let lastName = nameArray[1]

                    await setDoc(doc(db, "users", user.uid), {
                        firstName: firstName,
                        lastName: lastName,
                        email: user.email,
                        id: user.uid
                    }
                    );
                }
            }
        }
    }

    useEffect(() => {
        handleUser()
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