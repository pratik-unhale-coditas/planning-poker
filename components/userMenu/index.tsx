import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc } from "firebase/firestore";
import { signOut } from 'firebase/auth'

import { auth, db } from '@/repository/firebase'

import styles from './userMenu.module.scss'

import { IUserMenuProps } from './userMenu.types'

const UserMenu: React.FC<IUserMenuProps> = ({ userId }) => {
    const [user, setUser] = useState<any>(null)
    const getUser = async () => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setUser(docSnap.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    const router = useRouter()
    const [open, setOpen] = useState(false)

    const logout = async () => {
        await signOut(auth)
        router.push('/')
    }
    if (router.pathname === "/dashboard" || router.pathname === "/") {
        getUser()
    }
    const containerRef = useRef<any>(null)

    const handleClick = (event: any) => {
        if (
            containerRef &&
            !containerRef.current?.contains(event.target)
        )
            setOpen(false)
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    });

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div
            className={styles["container"]}
            onClick={(e) => {
                e.stopPropagation()
                setOpen(!open)
            }}
            ref={containerRef}
        >
            <button className={styles["userButton"]} onClick={() => setOpen(!open)}>
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
                {open ? <img src="/icons/chevronUp.svg" alt="" /> : <img src="/icons/chevronDown.svg" alt="" />}
            </button>
            {open ? <div className={styles['userMenu']}>
                <button className={styles["userMenuItem"]}

                    onClick={logout}>
                    Log Out
                </button>
            </div>
                : null
            }
        </div>)
}

export default UserMenu

