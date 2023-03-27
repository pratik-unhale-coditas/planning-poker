import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './sidebar.module.scss'

const Sidebar = () => {
    const router = useRouter()
    const path = router.route

    return (<div className={styles["container"]}>
        <div className={styles["sidebarItem"]}>
            <Link href={'/dashboard'} className={'/dashboard' === path ? styles["active"] : ""}>
                <img src="./icons/save.svg" alt="" />
                Saved Games
            </Link>
        </div>
        <div className={styles["sidebarItem"]}>
            <Link href={'/dashboard/createNewGame'} className={'/dashboard/createNewGame' === path ? styles["active"] : ""}>
                <img src="./icons/play.svg" alt="" />
                Create Game
            </Link>
        </div>
        <div className={styles["sidebarItem"]}>
            <Link href={'/dashboard/account'} className={'/dashboard/account' === path ? styles["active"] : ""}>
                <img src="./icons/user.svg" alt="" />
                Account
            </Link>
        </div>
    </div>)
}

export default Sidebar