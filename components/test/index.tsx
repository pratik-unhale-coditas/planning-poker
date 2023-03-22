import { auth } from "@/repository/firebase"
import { signOut } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import Header from "../header"


const Test = () => {
    const logout = async () => {
        await signOut(auth)
    }
    return (<>
        <Header />
        <button onClick={logout}>HAHA</button>
    </>)
}

export default Test