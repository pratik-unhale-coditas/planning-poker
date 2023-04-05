import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, getPlayerFromStore } from '@/repository/firebase'

import UserMenu from '../userMenu'

import styles from './header.module.scss'

const Header = () => {
    const [user] = useAuthState(auth)
    const router = useRouter()
    const { gid, id } = router.query
    const [isGuest, setIsGuest] = useState(false)
    const navigateToIndex = () => {
        user ? router.push("/dashboard") : router.push("/")
    }
    const checkIsGuest = async () => {
        if (!id) {
            setIsGuest(false)
        }
        else if (id && gid) {
            setIsGuest(Boolean(await getPlayerFromStore(gid as string, id as string)))
        }
    }

    useEffect(() => {
        checkIsGuest()
    }, [router])

    return (
        <header className={styles["header"]}>
            <div className={styles["start"]}>
                <div className={styles["logo"]} onClick={navigateToIndex}>
                    <img src="/icons/planningPokerLogo.png" alt="" />
                </div>
            </div>
            <div className={styles["end"]}>
                {user ?
                    <UserMenu userId={user.uid} />
                    : isGuest ? <div className={styles["guestTab"]}>Guest</div> :
                        <div className={styles["loginOptionsContainer"]}>
                            <button className={styles["button"]}>
                                <Link href={"/"} className={styles["loginPageLink"]}>Log In</Link>
                            </button>
                            <button className={[styles["button"], styles["registerButton"]].join(" ")}
                            >
                                <Link href={"/createNewAccount"} className={styles["createNewAccountLink"]}>      Register</Link>
                            </button>
                        </div>
                }
            </div>
        </header>
    )
}

export default Header