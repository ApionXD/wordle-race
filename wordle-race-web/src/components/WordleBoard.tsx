import React, {ReactElement, useEffect, useState} from 'react'
import WordRow from "./WordRow";

type BoardProps = {
    length: number
    height: number
}
export default function WordleBoard(props: BoardProps) {
    const [rowWords, setRowWords]: [string[], any] = useState([])
    const [curRow, setCurRow]: [number, any] = useState(0)
    let rows: ReactElement[] = []
    for (let i = 0; i < props.length; i++) {
        rows.push(<WordRow length={props.length} letters={rowWords[i]}/>)
    }
    useEffect(() => {
        console.log("Board updates")
    })
    return <div onKeyDown={(event) => {
        console.log(event.key)
        //You need to use the ellipses otherwise React wont trigger a rerender, it sees the new array as the same array
        let newRowWords = [...rowWords]
        if (event.key == 'Backspace') {
            newRowWords[curRow] = newRowWords[curRow] ? newRowWords[curRow].slice(0, -1) : newRowWords[curRow]
        }
        if (event.key == 'Enter') {
            setCurRow(curRow + 1)
        }
        else if (event.key.length == 1) {
            newRowWords[curRow] = newRowWords[curRow] ? newRowWords[curRow] + event.key : event.key
        }

        setRowWords(newRowWords)
        console.log(rowWords[curRow])
    }} tabIndex={0}>{rows}</div>
}