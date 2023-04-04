import Header from '@/components/header'

import styles from './indexLayout.module.scss'

import { IMainLayoutProps } from './indexLayout.types'

const IndexLayout: React.FC<IMainLayoutProps> = ({ children }) => {

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
