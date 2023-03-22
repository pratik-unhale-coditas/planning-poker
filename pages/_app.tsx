import IndexLayout from '@/components/layout/indexLayout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React, { PropsWithChildren, useEffect, useState } from 'react'

interface ComponentsWithPageLayout extends AppProps {
  Component: AppProps['Component'] & {
    PageLayout?: React.ComponentType<PropsWithChildren>
  }
}


export default function App({ Component, pageProps }: ComponentsWithPageLayout) {
  const PageLayout = Component.PageLayout || (({ children }) => <>{children}</>)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(false)
  }, [])
  return (
    <>
      {!isLoading ?
        <div className="main">
          <IndexLayout>
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>
          </IndexLayout>
        </div> : ""}
    </>
  )
}
