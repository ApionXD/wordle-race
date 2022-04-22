import React from "react";
import {Layer, Rect, Stage, Text} from "react-konva"

type TileProps = {
    //The current letter in the tile
    letter?: string | undefined
    color?: number | undefined
}
export default function WordTile(props: TileProps) {
    let color = props.color ? props.color : 0
    let letter = props.letter ? props.letter : ''
    let colorCode = "#3a3a3c"
    switch (color) {
            case (0):
                colorCode = "#3a3a3c"
                break
            case (1):
                colorCode = "#B59F3B"
                break
            case (2):
                colorCode = "#538D4E"
                break
        }
    return (
            <Stage width={48} height={48}>
                <Layer>
                    <Rect width={48} height={48} fill={colorCode}/>
                </Layer>
                <Layer>
                    <Text text={letter} fontSize={24} align={"center"} fill={"white"} padding={12}/>
                </Layer>
            </Stage>
        )
}