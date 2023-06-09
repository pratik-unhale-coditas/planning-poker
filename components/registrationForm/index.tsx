import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { doc, setDoc } from "firebase/firestore";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { auth, db } from '@/repository/firebase';

import styles from './registrationForm.module.scss'
import { IRegistrationFormInputs } from "./registrationForm.types";
import { useState } from "react";
import Snackbar from "../snackbar";

const schema = Yup.object({
    firstName: Yup.string().required('First Name Required'),
    lastName: Yup.string().required('Last Name required'),
    email: Yup.string()
        .email("Invalid email")
        .required("Email required"),
    password: Yup.string()
        .required("Password Required"),
});

const RegistrationForm = () => {

    const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState<string>("")

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    const { handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
        resolver: yupResolver(schema)
    });

    const router = useRouter()


    const onSubmit = async (data: IRegistrationFormInputs) => {
        const { email, password, firstName, lastName } = data
        try {
            if (db) {
                const res = await createUserWithEmailAndPassword(email, password)
                if (res) {
                    await setDoc(doc(db, "users", res.user.uid), {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        id: res.user.uid
                    }
                    );
                    router.push('/dashboard')
                }
                if (error) {
                    setShowSnackbar(true)
                    setSnackbarMessage(error.toString())
                }
            }
        } catch (e) {
            console.log(e)
        }

    };

    const handleInput = (event: any) => {
        setValue(event.target.name, event?.target.value)
    }

    return (
        <div className={styles["container"]}>
            <div className={styles["header"]}>
                <h2>Create New Account</h2>
            </div>

            <div className={styles["logIn"]}>
                <Link href={"/"} className={styles["logInLink"]}>Already have an account?</Link>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles["form"]}
            >
                <div className={styles["main"]}>
                    <div className={styles["inputContainer"]}>
                        <label className={styles["label"]}>First Name</label>
                        <input name="firstName" className={styles["input"]} type={"text"} onChange={handleInput} />
                    </div>
                    <p className={styles["inputWarningMessage"]}>{errors.firstName?.message}</p>
                    <div className={styles["inputContainer"]}>
                        <label className={styles["label"]}>Last Name</label>
                        <input name="lastName" className={styles["input"]} type={"text"} onChange={handleInput} />
                    </div>
                    <p className={styles["inputWarningMessage"]}>{errors.lastName?.message}</p>
                    <div className={styles["inputContainer"]}>
                        <label className={styles["label"]}>Email</label>
                        <input name="email" className={styles["input"]} type={"email"} onChange={handleInput} />
                    </div>
                    <p className={styles["inputWarningMessage"]}>{errors.email?.message}</p>
                    <div className={styles["inputContainer"]}>
                        <label className={styles["label"]}>Password</label>
                        <input name="password" className={styles["input"]} type={"password"} onChange={handleInput} />
                    </div>
                    <p className={styles["inputWarningMessage"]}>{errors.password?.message}</p>
                    <div className={styles["loginButtonContainer"]}>
                        <button className={styles["loginButton"]} type='submit'>
                            {loading ?
                                "Signing... Up" : "Sign up"
                            }
                        </button>
                    </div>
                </div>
            </form>
            {
                showSnackbar ? <Snackbar message={`Error :- ${snackbarMessage}`} showSnackbar={true} hideSnackbar={() => setShowSnackbar(false)} /> : null
            }
        </div>
    )
}

export default RegistrationForm