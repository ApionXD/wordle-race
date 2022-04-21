import React, {useEffect, useState} from 'react'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useStateMachine} from "little-state-machine";

type LeaderboardProps = {

}
export default function LeaderboardPage(props: LeaderboardProps){
    const { state } = useStateMachine()
    const navigate = useNavigate()
    const [top5users, setTop5users] = useState([])
    const [top5scores, setTop5scores] = useState([])
    useEffect(() => {
        setTimeout(() => {
            axios.get('/leaderboard').then(r => {
                console.log(r.data)
                setTop5users(r.data["top5users"])
                setTop5scores(r.data["top5scores"])
            })
        }, 5000)
    })
    const tableStyle = {
        color: 'white',
    }
    return (
    <div>
        <label>Top 5 Global</label>
        <table style={tableStyle}>
            <tr>
                <th>Player</th>
                <th>All-time Score</th>
            </tr>
            <tr>
                <th>{top5users[0]}</th>
                <th>{top5scores[0]}</th>
            </tr>
            <tr>
                <th>{top5users[1]}</th>
                <th>{top5scores[1]}</th>
            </tr>
            <tr>
                <th>{top5users[2]}</th>
                <th>{top5scores[2]}</th>
            </tr>
            <tr>
                <th>{top5users[3]}</th>
                <th>{top5scores[3]}</th>
            </tr>
            <tr>
                <th>{top5users[4]}</th>
                <th>{top5scores[4]}</th>
            </tr>
        </table>
        <button onClick={() => { navigate('/')}}>Home</button>
    </div>)
}