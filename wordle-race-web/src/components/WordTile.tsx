import React, {useEffect, useState} from "react";
import {Layer, Rect, Stage, Text} from "react-konva"

type TileProps = {
    //The current letter in the tile
    letter?: string
    color?: number
}
export default function WordTile(props: TileProps) {
    const [letterState, setLetterState]: [string | undefined, any] = useState("")
    const [colorState, setColorState]: [string, any] = useState("#3a3a3c")
    useEffect(() => {
        setLetterState(props.letter)
        switch (props.color) {
            case (0):
                setColorState("#3a3a3c")
                break
            case (1):
                setColorState("#B59F3B")
                break
            case (2):
                setColorState("#538D4E")
                break
        }
    })
    return (
            <Stage width={48} height={48}>
                <Layer>
                    <Rect width={48} height={48} fill={colorState}/>
                </Layer>
                <Layer>
                    <Text text={letterState} fontSize={24} align={"center"} fill={"white"} padding={12}/>
                </Layer>
            </Stage>
        )
}