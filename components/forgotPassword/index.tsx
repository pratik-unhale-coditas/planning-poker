import styles from './forgotPassword.module.scss'

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '@/repository/firebase';


const schema = Yup.object({
    email: Yup.string()
        .email("Invalid email")
        .required("Email required"),
});


const ForgotPassword = () => {
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(
        auth
    );

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

            if (res) {
                alert("reset password email sent")
            }
        } catch (e) {
            console.log(e)
        }
    };

    const handleEmailChange = (event: any) => {
        setValue('email', event?.target.value)
    }


    return (
        <form className={styles["container"]}
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
                    <button className={styles["submitButton"]}>Send New Password</button>
                </div>
            </div>
        </form>)
}

export default ForgotPassword