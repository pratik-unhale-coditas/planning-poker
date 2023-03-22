import styles from './indexLayout.module.scss'
import { PropsWithChildren } from 'react'
import Header from '@/components/header'

interface MainLayoutProps extends PropsWithChildren {

}

function IndexLayout({ children }: MainLayoutProps) {
    return (<div className={styles['mainLayoutContainer']}>
        <div>
            <Header />
        </div>
        <main className={styles['main']}>
            {children}
        </main>
    </div>)
}


export default IndexLayout


//    /* box-shadow: -4px 7px 4px -3px #bebbb4;