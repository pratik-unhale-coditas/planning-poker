import { auth } from '@/repository/firebase'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import UserMenu from '../userMenu'
import styles from './header.module.scss'



const Header = () => {
    const [user] = useAuthState(auth)
    const router = useRouter()
    const navigateToIndex = () => {
        user ? router.push("/dashboard") : router.push("/")
    }
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
                    :
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