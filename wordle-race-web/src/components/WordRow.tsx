import React, {ReactElement, useEffect, useState} from "react";
import WordTile from "./WordTile";

type RowProps = {
    //The letters in the WordRow, optional
    letters?: string
    colors?: number[]
    //The length of the word row
    length: number
}

export default function WordRow(props: RowProps): ReactElement {
    const [rowLetters, setRowLetters]: [string | undefined, any] = useState("")
    const [rowColors, setRowColors]: [number[], any] = useState([])
    const rowStyle = {
        display: 'flex',
        justifyContent: 'center',
    }
    let tilesList: ReactElement[] = []
    for (let i = 0; i < props.length; i++) {
        tilesList[i] = (
            <div style={{
                margin: '0.5%'
            }}>
                <WordTile letter={rowLetters?.at(i)} color={rowColors?.at(i)}/>
            </div>
            )
    }
    useEffect(() => {
        console.log("Row updated")
        setRowLetters(props.letters)
        setRowColors(props.colors)
    })
    return <div style={rowStyle}>{tilesList}</div>
}