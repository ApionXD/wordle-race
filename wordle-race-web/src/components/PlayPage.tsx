import WordleBoard from "./WordleBoard";
import {useState} from "react";
import {GlobalState, useStateMachine} from "little-state-machine";
import axios from "axios";

type PlayPageProp = {

}
export default function PlayPage(props: PlayPageProp) {
    const [curScore, setScore] = useState(0)
    const [opponentScore, setOpScore] = useState(0)
    const { state } = useStateMachine()
    console.log(state?.gameDetails?.boardsize!)
    const doCheck = setInterval(() => {
        clearInterval(doCheck)
    }, 10000)
    return (
        state?.gameDetails?.opponent ?
        <div>
            <WordleBoard length={state?.gameDetails?.boardsize!} height={5}></WordleBoard>
            <label>Opponent: {state?.gameDetails?.opponent}</label>
        </div>
            :
            <div>
                "No current game"
            </div>
    )
}