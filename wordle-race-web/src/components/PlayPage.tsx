import WordleBoard from "./WordleBoard";
import {useState} from "react";
import {useStateMachine} from "little-state-machine";
import Timer from "./Timer";
import axios from "axios";

type PlayPageProp = {

}
export default function PlayPage(props: PlayPageProp) {
    const [rowWords, setRowWords]: [string[], any] = useState([])
    const [rowColors, setRowColors]: [number[][], any] = useState([])
    const [curRow, setCurRow]: [number, any] = useState(0)
    const [errorText, setErrorText] = useState("")
    const [curScore, setScore] = useState(0)
    const [opponentScore, setOpScore] = useState(0)
    const { state } = useStateMachine()
    const checkGuess = () => {
        let guess = rowWords[curRow]
        if (guess.length == state?.gameDetails?.boardsize) {
            axios.post('/check', {
                "id": state?.gameDetails?.id,
                "guess": guess,
                "curRow": curRow
            }).then((r) => {
                if (r.data.response == "Success") {
                    let newRowColors = [...rowColors]
                    newRowColors[curRow] = r.data.colors
                    console.log(newRowColors[curRow])
                    setScore(r.data.score)
                    if (newRowColors[curRow].every((i) => i==2)) {
                        setErrorText("Loading next board...")
                        setTimeout(() => {
                            clearBoard()
                            setErrorText("")
                        }, 5000)
                    }
                    else if (curRow == 4) {
                        setErrorText("Loading next board...")
                        axios.post("/skip_board").then(r => {
                            setTimeout(() => {
                                clearBoard()
                                setErrorText("")
                            }, 5000)
                        })
                    }
                    setRowColors(newRowColors)
                    setCurRow(curRow => curRow + 1)
                }
                if (r.data.response == "Not Word") {
                    setErrorText(rowWords[curRow] + " is not a word")
                }
                if (r.data.response == "Time's Up") {
                    setErrorText("Time's Up")
                }
            })
        }
        else {
            setErrorText("Please enter a valid word!")
        }
    }

    const addLetter = (letter) => {
        if (letter.match("[a-zA-Z]+") && letter.length == 1) {
            letter = letter.toUpperCase()
            if (rowWords[curRow]?.length != state?.gameDetails?.boardsize) {
                let newRowWords = [...rowWords]
                newRowWords[curRow] = newRowWords[curRow] ? newRowWords[curRow] + letter : "" + letter
                setRowWords(newRowWords)
            }
        }
    }
    const deleteLastLetter = () => {
        if (rowWords[curRow].length > 0) {
            let newRowWords = [...rowWords]
            newRowWords[curRow] = newRowWords[curRow].slice(0, -1)
            console.log(newRowWords[curRow])
            setRowWords(newRowWords)
        }
    }
    const onPress = (event) => {
        console.log(event.key)
        if (event.key == 'Backspace') {
            console.log("Backspace")
            deleteLastLetter()
        }
        else if (event.key == 'Enter') {
            checkGuess()
        }
        else {
            console.log(event.key)
            addLetter(event.key)
        }
    }
    const clearBoard = () => {
        setRowWords([])
        setRowColors([])
        setCurRow(0)
    }
    return (
        state?.gameDetails?.opponent ?
        <div onKeyDown={(event) => {onPress(event)}} tabIndex={0}>
            <Timer time={300}></Timer>
            <WordleBoard length={state?.gameDetails?.boardsize!} height={5} rowWords={rowWords} rowColors={rowColors} curRow={curRow}></WordleBoard>
            <label>{errorText}</label><br/>
            <label>Opponent: {state?.gameDetails?.opponent}</label><br/>
            <label>Score: {curScore}</label><br/>
            <label>Opponent Score: {opponentScore}</label><br/>
        </div>
            :
            <div>
                "No current game"
            </div>
    )
}