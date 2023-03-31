import styles from './loginForm.module.scss'

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import Link from 'next/link';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/repository/firebase';
import { useRouter } from 'next/router';
import Snackbar from '../snackbar';
import { useState } from 'react';



const schema = Yup.object({
    email: Yup.string()
        .email("Invalid email")
        .required("Email required"),
    password: Yup.string()
        .required("Password Required"),
});



const LoginForm = () => {

    const router = useRouter();
    const { handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: yupResolver(schema)
    });

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    if (user) {
    }

    const [showSnackbar, setShowSnackbar] = useState(false)

    const onSubmit = async (data: any) => {
        const { email, password } = data
        try {
            const res = await signInWithEmailAndPassword(email, password)
            if (res) {
                router.push("/dashboard")
            } else if (error) {
                setShowSnackbar(true)
            }


        }
        catch (e) {
            console.log(e)
        }
    };

    const handleEmailChange = (event: any) => {
        setValue('email', event?.target.value)
    }
    const handlePasswordChange = (event: any) => {
        setValue('password', event?.target.value)
    }

    return (
        <div className={styles["container"]}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles["form"]}
            >
                <div className={styles["title"]}>
                    <h2>Log In</h2>
                </div>
                <div className={styles["main"]}>
                    <div className={styles["inputContainer"]}>
                        <label className={styles["label"]}>Email</label>
                        <input name="email" className={styles["input"]} type={"email"} onChange={handleEmailChange} />
                    </div>
                    <p className={styles["inputWarningMessage"]}>{errors.email?.message}</p>
                    <div className={styles["inputContainer"]}>
                        <label className={styles["label"]}>Password</label>
                        <input name="password" className={styles["input"]} type={"password"} onChange={handlePasswordChange} />
                    </div>
                    <p className={styles["inputWarningMessage"]}>{errors.password?.message}</p>
                    <div className={styles["loginButtonContainer"]}>
                        <button className={styles["loginButton"]} type='submit'>
                            {loading ?
                                "Logging In..." : "Log In"
                            }
                        </button>
                    </div>
                </div>
            </form>

            <div className={styles["forgotPassword"]}>
                <Link href={"forgotPassword"} className={styles["forgotPasswordLink"]}>Forgot your password?</Link>
            </div>
            <div className={styles["createNewAccount"]}>
                <Link href={"createNewAccount"} className={styles["createNewAccountLink"]}>Create New Account</Link>
            </div>
            {
                showSnackbar ? <Snackbar message={`Error :- ${error}`} showSnackbar={true} hideSnackbar={() => setShowSnackbar(false)} /> : null
            }
        </div>)
}


export default LoginForm

