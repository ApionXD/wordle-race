import WordleBoard from "./WordleBoard";
import {useEffect, useState} from "react";
import {useStateMachine} from "little-state-machine";
import Timer from "./Timer";

type PlayPageProp = {

}
export default function PlayPage(props: PlayPageProp) {
    const [curScore, setScore] = useState(0)
    const [opponentScore, setOpScore] = useState(0)
    const [timeOut, setTimeOut] = useState(0)
    const { state } = useStateMachine()
    console.log(state?.gameDetails?.boardsize!)
    const doCheck = setInterval(() => {
        clearInterval(doCheck)
    }, 10000)
    return (
        state?.gameDetails?.opponent ?
        <div>
            <Timer time={30}></Timer>
            <WordleBoard length={state?.gameDetails?.boardsize!} height={5}></WordleBoard>
            <label>Opponent: {state?.gameDetails?.opponent}</label>
        </div>
            :
            <div>
                "No current game"
            </div>
    )
}