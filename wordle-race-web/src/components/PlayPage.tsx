import WordleBoard from "./WordleBoard";
import {useState} from "react";
import {GlobalState, useStateMachine} from "little-state-machine";

type PlayPageProp = {

}
export default function PlayPage(props: PlayPageProp) {
    const [curScore, setScore] = useState(0)
    const [opponentScore, setOpScore] = useState(0)
    const { state } = useStateMachine()
    const doCheck = setInterval(() => {
        clearInterval(doCheck)
    }, 10000)
    return (
        state?.gameDetails?.opponent ?
        <div>
            <WordleBoard length={5} height={5}></WordleBoard>
            <p>Opponent: {state?.gameDetails?.opponent}</p>
        </div>
            :
            <div>
                "No current game"
            </div>
    )
}