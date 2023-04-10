import { useEffect, useState } from "react"
import { useAuthState, useUpdatePassword } from "react-firebase-hooks/auth"
import { useForm } from "react-hook-form"
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import Image from "next/image";

import { auth, getUserFromStore, updateUserDataInStore } from "@/repository/firebase"

import Snackbar from "../snackbar"

import styles from "./profile.module.scss"


const Profile = () => {

    const [updatePassword, updating, error] = useUpdatePassword(auth);

    const [user] = useAuthState(auth)

    const [currentUser, setCurrentUser] = useState<any>()

    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [isEditingPersonalDetails, setIsEditingPersonalDetails] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)

    const getUser = async () => {
        if (user) {
            const currentUser = await getUserFromStore(user?.uid as string)
            if (currentUser) {
                setCurrentUser(currentUser)
            }
        }
    }
    const handleUpdateProfile = async (data: any) => {
        const res = await updateUserDataInStore(user?.uid as string, data)
        if (res) {
            setIsEditingPersonalDetails(false)
        }
    }

    const handleUpdatePassword = async (data: IPasswordFormValues) => {
        const { password } = data
        try {
            const success = await updatePassword(password);
            if (success) {
                setIsEditingPassword(false)
                setShowSnackbar(true)
            } else if (error) {
                setShowSnackbar(true)
            }
        } catch (e) {

            setShowSnackbar(true)
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
                        >
                            <Image src="/icons/edit.svg" alt="" width={24} height={24} />
                        </button>
                        : null
                    }
                </div>
                {
                    currentUser ?
                        <ProfileDetailsForm
                            email={currentUser.email}
                            firstName={currentUser.firstName}
                            lastName={currentUser.lastName}
                            onSubmit={handleUpdateProfile}
                            onCancel={() => setIsEditingPersonalDetails(false)}
                            isEditing={isEditingPersonalDetails}
                        />
                        : null
                }
                {user?.providerData[0].providerId === "password" ?
                    <>
                        <div className={styles["subTitle"]}>
                            <h3>
                                Password
                            </h3>
                            {!isEditingPassword ?
                                <button
                                    className={styles["editButton"]}
                                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                                >
                                    <Image src="/icons/edit.svg" alt="" width={24} height={24} />
                                </button>
                                : null
                            }
                        </div>
                        <div className={isEditingPassword ? styles["passwordSection"] : styles["passwordSectionHidden"]}>

                            <PasswordForm
                                onSubmit={handleUpdatePassword}
                                onCancel={() => setIsEditingPassword(false)}
                            />
                        </div>
                    </> : null
                }
            </div>
            {
                showSnackbar ? <Snackbar message={error ? `Error :- ${error}` : "Password changed successfully"} showSnackbar={true} hideSnackbar={() => setShowSnackbar(false)} /> : null
            }
        </div>)
}

export default Profile
//////////////////////////////////////////////////////////////////////////
type IProfileDetailsFormValues = {
    firstName: string;
    lastName: string;
};

interface IProfileDetailsFormProps {
    email: string;
    firstName: string;
    lastName: string;
    onSubmit: (data: IProfileDetailsFormValues) => void;
    onCancel: () => void;
    isEditing: boolean
}
const IProfileDetailsSchema = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
});

export const ProfileDetailsForm = ({ email, firstName, lastName, onSubmit, onCancel, isEditing }: IProfileDetailsFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IProfileDetailsFormValues>({
        resolver: yupResolver(IProfileDetailsSchema),
        defaultValues: {
            // email,
            firstName,
            lastName,
        },
    });



    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles["inputContainer"]}>
                <label className={styles["label"]}>Email</label>
                <input
                    disabled
                    className={styles["input"]}
                    value={email}
                />
            </div>
            <div className={styles["nameContainer"]}>
                <div className={styles["inputContainer"]}>
                    <label className={styles["label"]}>First Name</label>
                    <input
                        disabled={!isEditing}
                        className={styles["input"]}
                        type={"text"}
                        {...register('firstName')}
                    />
                    {errors.firstName && (
                        <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                    )}
                </div>
                <div className={styles["inputContainer"]}>
                    <label className={styles["label"]}>Last Name</label>
                    <input
                        disabled={!isEditing}
                        className={styles["input"]}
                        type={"text"}
                        {...register('lastName')}
                    />

                    {errors.lastName && (
                        <span className="text-red-500 text-sm">{errors.lastName.message}</span>
                    )}
                </div>
            </div>
            {isEditing ?
                <div className={styles["actionsContainer"]}>
                    <button type="submit" className={styles["saveButton"]}>Save</button>
                    <button type="button" onClick={onCancel} className={styles["cancelButton"]}>Cancel</button>
                </div> : null
            }
        </form>
    );
};
//////////////////////////////////////////////////////////////
const passwordSchema = Yup.object().shape({
    password: Yup.string().required("Please enter a new password"),
    confirmPassword: Yup
        .string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your new password"),
});
type IPasswordFormValues = {
    password: string,
    confirmPassword: string
};

export const PasswordForm = ({ onSubmit, onCancel }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<IPasswordFormValues>({
        resolver: yupResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });
    const handleCancel = () => {
        onCancel()
        reset()
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className={styles["passwordContainer"]}>
                <div className={styles["inputContainer"]}>
                    <label className={styles["label"]}>Password</label>
                    <input
                        className={styles["input"]}
                        type={"password"}
                        {...register('password')}
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm">{errors.password.message}</span>
                    )}
                </div>
                <div className={styles["inputContainer"]}>
                    <label className={styles["label"]}>Confirm Password</label>
                    <input
                        className={styles["input"]}
                        type={"text"}
                        {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                    )}
                </div>
            </div>
            <div className={styles["actionsContainer"]}>
                <button type="submit" className={styles["saveButton"]}>Save</button>
                <button type="button" onClick={handleCancel} className={styles["cancelButton"]}>Cancel</button>
            </div>
        </form>
    );
}