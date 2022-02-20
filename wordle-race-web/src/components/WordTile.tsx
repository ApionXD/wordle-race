import React, {useEffect, useState} from "react";
import {Layer, Rect, Stage, Text} from "react-konva"

type TileProps = {
    //The current letter in the tile
    letter?: string
}
export default function WordTile(props: TileProps) {
    const [letterState, setLetterState]: [string | undefined, any] = useState("")
    useEffect(() => {
        setLetterState(props.letter)
    })
    return (
            <Stage width={48} height={48}>
                <Layer>
                    <Rect width={48} height={48} fill={"#3a3a3c"}/>
                </Layer>
                <Layer>
                    <Text text={letterState} fontSize={24} align={"center"} fill={"white"} padding={12}/>
                </Layer>
            </Stage>
        )
}