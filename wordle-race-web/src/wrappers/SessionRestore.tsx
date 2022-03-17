import {GlobalState, useStateMachine} from "little-state-machine";
import axios from "axios";
import {useEffect} from "react";

type SessionRestoreProps = {
    children: JSX.Element
}
const updateName = (state: GlobalState, new_username: string) => ({
    ...state,
    username: new_username
});
export default function SessionRestore(props: SessionRestoreProps){
    let {actions, state} = useStateMachine({
        updateName
    })
    useEffect(() => {
        if (!state.username) {
            axios.get("/check_session").then((response) => {
                if (response.data.response === "Success") {
                    actions.updateName(response.data.username)
                }
            })

        }
    }, [""])
    return props.children
}