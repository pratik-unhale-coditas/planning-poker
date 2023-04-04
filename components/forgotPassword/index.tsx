import { useState } from 'react';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

import { auth } from '@/repository/firebase';

import Snackbar from '../snackbar';

import styles from './forgotPassword.module.scss'

const schema = Yup.object({
    email: Yup.string()
        .email("Invalid email")
        .required("Email required"),
});


const ForgotPassword = () => {
    const [userEmail, setUserEmail] = useState("")
    const [isPasswordResetSuccessfull, setIsPasswordResetSuccessfull] = useState(false)
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(
        auth
    );
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState<any>("")

    const { handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            email: "",
        },
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data: any) => {
        const { email } = data
        try {
            const res = await sendPasswordResetEmail(
                email,
            );
            if (error) {
                setSnackbarMessage(error.toString())
                setShowSnackbar(true)
            }
            if (res) {
                setIsPasswordResetSuccessfull(true)
            }
        } catch (e) {
            console.log(e)
        }
    };

    const handleEmailChange = (event: any) => {
        setValue('email', event?.target.value)
        setUserEmail(event.target.value)
    }


    return (
        isPasswordResetSuccessfull ?
            <div className={styles["successContainer"]}>
                <h2>Password Reset Link Sent!</h2>
                <p>A password reset link has been sent to {userEmail || "your email"}.</p>
                <p>Please check your email and follow the instructions provided to reset your password.</p>
                { /*eslint-disable-next-line react/no-unescaped-entities */}
                <p>If you don't see the email in your inbox, be sure to check your spam or junk folder.</p>
                <p>Thank you for using our website!</p>
                <Link href={'/'} className={styles["loginPageLink"]}>Go back to login page</Link>
            </div> :

            <div>
                <form
                    className={styles["container"]}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className={styles["header"]}>
                        <h2>Reset Your Password</h2>
                    </div>
                    <div className={styles["main"]}>
                        <div className={styles["description"]}>
                            <p>Enter the work email you used to sign up, and we will send you a new password</p>
                        </div>
                        <div className={styles["inputContainer"]}>
                            <label className={styles["label"]}>Work Email</label>
                            <input name="email" className={styles["input"]} type={"email"} onChange={handleEmailChange} />
                        </div>
                        <p className={styles["inputWarningMessage"]}>{errors.email?.message}</p>
                        <div className={styles["submitButtonContainer"]}>
                            <button className={styles["submitButton"]} type="submit">
                                {sending ? "Sending..." :
                                    "Send New Password"
                                }
                            </button>
                        </div>
                    </div>
                </form>
                {
                    showSnackbar ? <Snackbar message={snackbarMessage as string} showSnackbar={true} hideSnackbar={() => setShowSnackbar(false)} /> : null
                }
            </div>

    )
}

export default ForgotPassword