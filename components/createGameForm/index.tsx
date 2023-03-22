import { auth, db } from '@/repository/firebase';
import { addNewGame } from '@/service/games';
import { GameType, NewGame } from '@/types/game';
import { Player } from '@/types/player';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import CustomRadioList from '../customRadioList';
import styles from './createGameForm.module.scss'

const CreateGameForm = () => {

    const [user] = useAuthState(auth)
    const [currentPlayer, setCurrentPlayer] = useState<any>(null)
    const docRef = doc(db, "users", user?.uid as string);


    const getUser = async () => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCurrentPlayer(docSnap.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }
    const options = [
        { label: 'Fibonacci(0,1,3,5,8,13,21,34,?)', value: GameType.Fibonacci },
        { label: 'Powers of 2(0,1,2,4,8,16,32,64,?)', value: GameType.PowersOfTwo },
        { label: 'T-shirts(xxs,xs,s,m,l,xl,xxl,xxxl,?)', value: GameType.TShirt },
    ];


    const [gameTitle, setGameTitle] = useState('')
    const [gameType, setGameType] = useState(GameType.Fibonacci);
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleCheckboxChange = (value: any) => {
        setGameType(value);
    }


    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (gameTitle && currentPlayer) {
            console.log("in")
            setIsLoading(true);
            const game: NewGame = {
                name: gameTitle,
                createdByName: currentPlayer.firstName,
                createdById: currentPlayer.id,
                gameType: gameType,
                createdAt: new Date()
            }
            const newGameId = await addNewGame(game);
            if (newGameId) {
                setIsLoading(false);
            }
            router.push(`/game/${newGameId}`)
            setGameTitle("")
        }
    };
    const isCreateButtonActive = () => {
        if (isLoading) {
            return false
        }
        else if (isLoading || gameTitle.trim().length) {
            return true
        }
    }
    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className={styles["container"]}>
            <h2 className={styles["title"]}>Create New Game</h2>
            <form className={styles["form"]} onSubmit={onSubmit}>
                <div className={styles["inputContainer"]}>
                    <label className={styles["label"]}>Game Name</label>
                    <input
                        name="gameTitle"
                        className={styles["input"]}
                        type={"text"}
                        onChange={(e) => setGameTitle(e.target.value)}
                    />
                </div>
                <div className={styles["deckSelectorContainer"]}>
                    <CustomRadioList title="Select your card deck" options={options} selectedOption={gameType} onChange={handleCheckboxChange} />
                </div>
                <div className={styles["createButtonContainer"]}>
                    <button
                        className={isCreateButtonActive() ? styles["createButtonActive"] : styles["createButton"]}
                        type={'submit'}
                        disabled={!isCreateButtonActive()}
                    >Create
                    </button>
                </div>
            </form>
        </div>)
}

export default CreateGameForm
