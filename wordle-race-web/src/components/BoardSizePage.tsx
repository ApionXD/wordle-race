import React from "react";
import axios from "axios";
import {Navigate, useNavigate} from "react-router-dom";
import {GlobalState, useStateMachine} from "little-state-machine";

type BoardSizeProps = {

}

const setBoardSize = (state:GlobalState, boardSize: number) => ({
    ...state,
    gameDetails: {
        boardsize: boardSize
    }
})

export default function BoardSizePage(props: BoardSizeProps){
    let {actions, state} = useStateMachine({
        setBoardSize
    })
    const navigate = useNavigate()
    const submit = () => {
            var e = document.getElementsByName('boardSize') as NodeListOf<HTMLInputElement>;
            for (let i = 0; i < e.length; i++) {
                if (e[i].checked) {
                    console.log(e[i].value)
                    actions.setBoardSize(parseInt(e[i].value))
                }
            }
            console.log(state?.gameDetails?.boardsize)
            navigate("/")
    }
    return (
    <div>
        <form>
            <input type="radio" name="boardSize" value="4" />Four<br/>
            <input type="radio" name="boardSize" value="5" />Five<br/>
            <input type="radio" name="boardSize" value="6" />Six<br/>
            <button type="button" onClick={submit}>Submit</button>
        </form>
    </div>)
}