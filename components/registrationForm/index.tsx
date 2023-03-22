
import styles from './registrationForm.module.scss'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import Link from 'next/link';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/repository/firebase';
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/router';

interface IRegistrationFormInputs {
    firstName: string,
    lastName: string,
    email: string,
    password: string,

}

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
                    const setRes = await setDoc(doc(db, "users", res.user.uid), {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        id: res.user.uid
                    }

                    );

                }
                router.push('/dashboard')
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
                    <div className={styles["inputContainer"]}>
                        <label className={styles["label"]}>Last Name</label>
                        <input name="lastName" className={styles["input"]} type={"text"} onChange={handleInput} />
                    </div>
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
                        <button className={styles["loginButton"]} type='submit'>Sign Up</button>
                    </div>
                </div>
            </form>

        </div>
    )
}

export default RegistrationForm