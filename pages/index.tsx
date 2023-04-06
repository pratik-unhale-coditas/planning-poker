import Head from 'next/head'
import styles from '@/styles/home.module.scss'
import LoginForm from '@/components/loginForm'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/repository/firebase'
import { useRouter } from 'next/router'

export default function Home() {
  const [user] = useAuthState(auth)
  const router = useRouter()

  const navigateTo = () => {
    router.push('/dashboard')
  }

  useEffect(() => {
    user ? navigateTo() : null
  }
    , [user])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <LoginForm />
      </>
    </>
  )
}
