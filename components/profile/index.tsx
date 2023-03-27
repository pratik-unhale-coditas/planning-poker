import { auth, getUserFromStore } from "@/repository/firebase"
import { useEffect, useState } from "react"
import { useAuthState, useUpdatePassword } from "react-firebase-hooks/auth"
import styles from "./profile.module.scss"

const Profile = () => {
    const [updatePassword, updating, error] = useUpdatePassword(auth);

    const [user] = useAuthState(auth)
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [isEditingPersonalDetails, setIsEditingPersonalDetails] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const getUser = async () => {
        const currentUser = await getUserFromStore(user?.uid as string)
        if (currentUser) {
            setEmail(currentUser.email)
            setFirstName(currentUser.firstName)
            setLastName(currentUser.lastName)
        }
    }


    const handleUpdatePassword = async () => {
        if (password && confirmPassword && confirmPassword === password) {
            const success = await updatePassword(password);
            if (success) {
                setIsEditingPassword(false)
            }
        }
    }

    useEffect(() => { getUser() }, [])

    return (
        <div className={styles["container"]}>
            <h2 className={styles["title"]}>
                Account</h2>
            <div className={styles["main"]}>
                <div className={styles["subTitle"]}>
                    <h3>
                        Personal Details
                    </h3>
                    {!isEditingPersonalDetails ?
                        <button
                            className={styles["editButton"]}
                            onClick={() => setIsEditingPersonalDetails(!isEditingPersonalDetails)}
                        ><img src="/icons/edit.svg" alt="" /></button>
                        : null
                    }
                </div>
                <div className={styles["inputContainer"]}>
                    <label className={styles["label"]}>Email</label>
                    <input
                        name="email"
                        className={styles["input"]}
                        type={"email"}
                        onChange={(e) => console.log(e.target.value)}
                        defaultValue={email}
                        disabled={!isEditingPersonalDetails} />
                </div>
                <div className={styles["nameContainer"]}>
                    <div className={styles["inputContainer"]}>
                        <label className={styles["label"]}>First Name</label>
                        <input
                            name="firstName"
                            className={styles["input"]}
                            type={"text"}
                            onChange={(e) => console.log(e.target.value)}
                            defaultValue={firstName}
                            disabled={!isEditingPersonalDetails} />
                    </div>
                    <div className={styles["inputContainer"]}>
                        <label className={styles["label"]}>Last Name</label>
                        <input
                            name="lastName"
                            className={styles["input"]}
                            type={"text"}
                            onChange={(e) => console.log(e.target.value)}
                            defaultValue={lastName}
                            disabled={!isEditingPersonalDetails} />
                    </div>
                </div>
                {isEditingPersonalDetails ?
                    <div className={styles["actionsContainer"]}>
                        <button
                            onClick={() => setIsEditingPersonalDetails(false)}
                            className={styles["saveButton"]}
                        >Save</button>
                        <button
                            onClick={() => setIsEditingPersonalDetails(false)}
                            className={styles["cancelButton"]}
                        >Cancel</button>
                    </div> : null
                }
                <div className={styles["subTitle"]}>
                    <h3>
                        Password
                    </h3>
                    {!isEditingPassword ?
                        <button
                            className={styles["editButton"]}
                            onClick={() => setIsEditingPassword(!isEditingPassword)}
                        ><img src="/icons/edit.svg" alt="" /></button>
                        : null
                    }
                </div>
                <div className={isEditingPassword ? styles["passwordSection"] : styles["passwordSectionHidden"]}>
                    <div className={styles["passwordContainer"]}>
                        <div className={styles["inputContainer"]}>
                            <label className={styles["label"]}>New Password</label>
                            <input
                                name="password"
                                className={styles["input"]}
                                type={"password"}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles["inputContainer"]}>
                            <label className={styles["label"]}>Confirm Password</label>
                            <input
                                name="confirmPassword"
                                className={styles["input"]}
                                type={"text"}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles["actionsContainer"]}>
                        <button
                            onClick={handleUpdatePassword}
                            className={styles["saveButton"]}
                        >Save</button>
                        <button
                            onClick={() => setIsEditingPassword(false)}
                            className={styles["cancelButton"]}
                        >Cancel</button>
                    </div>
                </div>
            </div>

        </div>)
}

export default Profile