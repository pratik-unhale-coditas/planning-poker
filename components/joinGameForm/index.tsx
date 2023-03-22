import styles from './joinGameForm.module.scss'

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getGame } from '@/service/games';
import { addPlayerToGame, isCurrentPlayerInGame } from '@/service/players';



// const schema = Yup.object({
//     name: Yup.string().required("Display Name Required"),
//     email: Yup.string()
//         .email("Invalid email")
//         .required("Email required"),
// });


const JoinGameForm = () => {
    const router = useRouter()
    const { gid } = router.query

    const [joinGameId, setJoinGameId] = useState(gid as string);
    const [playerName, setPlayerName] = useState('');
    const [gameFound, setIsGameFound] = useState(true);
    const [showNotExistMessage, setShowNotExistMessage] = useState(false);
    const [loading, setLoading] = useState(false);


    // const { handleSubmit, formState: { errors }, setValue } = useForm({
    //     defaultValues: {
    //         name: "",
    //         email: "",
    //     },
    //     resolver: yupResolver(schema)
    // });

    const onSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true);
        if (joinGameId) {
            const res = await addPlayerToGame(joinGameId, playerName);

            setIsGameFound(res);
            if (res) {
                router.push(`/game/${joinGameId}`);
            }
            setLoading(false);
        }
    };

    // const handleNameChange = (event: any) => {
    //     setValue('name', event?.target.value)
    // }
    // const handleEmailChange = (event: any) => {
    //     setValue('email', event?.target.value)
    // }

    useEffect(() => {
        async function fetchData() {
            if (joinGameId) {
                if (await getGame(joinGameId)) {
                    setIsGameFound(true);
                    if (await isCurrentPlayerInGame(joinGameId)) {
                        router.push(`/game/${joinGameId}`);
                    }
                } else {
                    setShowNotExistMessage(true);
                    setTimeout(() => {
                        router.push('/');
                    }, 5000)
                }
            }
        }
        fetchData();
    }, [joinGameId, history]);

    return (
        <form className={styles["container"]}
            onSubmit={
                // handleSubmit(
                onSubmit
                // )
            }
        >
            <div className={styles["header"]}>
                <h2>Join A Game</h2>
                <button><img src="./icons/x.svg" alt="" /> Close</button>
            </div>
            <div className={styles["main"]}>
                <div className={styles["inputContainer"]}>
                    <label className={styles["label"]}>Display Name</label>
                    <input name="name" className={styles["input"]} type={"text"} onChange={(e) => setPlayerName(e.target.value)} />
                </div>
                {/* <p className={styles["inputWarningMessage"]}>{errors.email?.message}</p> */}
                {/* <div className={styles["inputContainer"]}>
                    <label className={styles["label"]}>Work Email</label>
                    <input name="email" className={styles["input"]} type={"email"} onChange={handleEmailChange} />
                </div> */}
                {/* <p className={styles["inputWarningMessage"]}>{errors.email?.message}</p> */}
                <div className={styles["submitButtonContainer"]}>
                    <button className={styles["submitButton"]}>Join</button>
                </div>
            </div>
        </form>)
}

export default JoinGameForm