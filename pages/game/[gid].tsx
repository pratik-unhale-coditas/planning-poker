import Game from "@/components/game"
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface GamePageProps {
    gid: string;
}

const GamePage = ({ gid }: GamePageProps) => {
    return <Game gid={gid} />;
};

export default GamePage;

export const getServerSideProps: GetServerSideProps<GamePageProps> = async (context) => {
    const gid = context.query.gid?.toString() as string;

    return {
        props: {
            gid,
        },
    };
};
