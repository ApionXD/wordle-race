import React, {ReactElement, useEffect} from 'react'
import WordRow from "./WordRow";

type BoardProps = {
    length: number
    height: number
    p1words?: string[] | undefined
    p2words?: string[] | undefined
    player1: string
    player2: string
    //rowColors?: number[][] | undefined
    curRow: number
}
const playerStyle = {
    display: 'flex',
    justifyContent: 'center',
}

export default function WordleBoard(props: BoardProps)
{
    let rows: ReactElement[][] = findRows(props.p1words, props.length)
    let rows2: ReactElement[][] = findRows(props.p2words, props.length)

    useEffect(() => {
        console.log("Board updates")
    })
    return <div >
        <label style={playerStyle}>{props.player1}:</label>
        {rows}
        <label style={playerStyle}>{props.player2}:</label>
        {rows2}
    </div>

}
    function findRows(words, length)
    {
        let rowWords = [""]
        let rowColors = [0]
        let count = 0
        let rows: ReactElement[][] = []
        for (let i =0; i<words.length; i++)
        {

            if (words[i].startsWith("undefined")) //sees if added to something that was instantiad yet
            {
                words[i] = words[i].substring(9)
            }
            console.log(words[i])
            let curLoc = 0
            rowWords[curLoc] = ""
            rowColors[curLoc] = 0
            let rowCol = []
            let curRow = 0
            rows[i] = []
            for (let j=0; j<words[i].length-length; j+=4) //loops through and adds words /colors
            {

                rowWords[curLoc] += words[i].substring(j, j+1)
                //console.log(words[i].substring(j+2, j+3))
                rowColors[curRow]= parseInt(words[i].substring(j+2, j+3))
                curRow++
                if (length==rowWords[curLoc].length)
                {
                    count = 0
                    for (let x=0; x<length; x++) //Don't draw if they got it correct
                    {
                        if (rowColors[x]==2)
                        {
                            count++
                        }
                    }
                    if (count!=length)
                    {
                        rows[i].push(<WordRow length={length} letters={rowWords[curLoc]} colors={rowColors}/>)
                        curLoc++
                        curRow = 0
                        rowWords[curLoc] = ""
                        rowColors = []
                        rowCol = []
                        j-- //used because there isn't a comma between words
                    }
                }
            }
            console.log(rowWords)
            //console.log(rowColors)


            let end = words[i].substring(words[i].length-length)
            let colors = []
            for (let j =0; j<length; j++) //adds the end word
            {
                colors[j] = 2
            }
            rows[i].push(<WordRow length={length} letters={end} colors={colors}/>)
            let colors2 = []
            for (let j =0; j<length; j++) //adds a separator between words
            {
                colors2[j] = 3
            }
            if (i+1!=words.length)
            {
                rows[i].push(<WordRow length={length} letters={"------------"} colors={colors2}/>)
            }
        }
        return rows
    }


