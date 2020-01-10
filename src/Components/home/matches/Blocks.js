import React, { Component } from 'react';
import {firebaseMatches} from '../../../firebase'

import { firebaseLooper, reverseArray } from '../../ui/misc'

import MatchesBlock from '../../ui/matches_block'
import Slide from 'react-reveal/Slide'

class Blocks extends Component {

    state = {
        matches:[]
    }

    
    showMatches=()=>(
        <div>matcheeee</div>
    )

    componentDidMount(){
        firebaseMatches.limitToLast(6).once('value').then((snapshot)=>{
            const matches = firebaseLooper(snapshot)

            this.setState({
                matches: reverseArray(matches)
            })
        })
    }

    showMatches = (matches) => (
        matches ? matches.map((match)=>(
            <Slide bottom key={match.id}>
            <div className="item">
                <div className="wrapper">
                    <MatchesBlock match= {match}/>
                </div>
            </div>
            </Slide>
        )) : null
    )
    //     this.state.matches.map(({away})=>(
            
    //         console.log("bbbbb"+away+"=="+i)
    //    ))
        // let value =  this.state.matches
        //         for (var i in value) {
        //             console.log("bbbbb"+value[i].away);
        //           }
                // this.state.matches.map((value,i)=>{
                //     return (<div>{console.log("bbbbb"+value[i])}</div>)
                // })
        
    

    render() {
        console.log("ccccccc"+this.state.matches.away)
        return (
            <div className="home_matches">
                {this.showMatches(this.state.matches)}
            </div>
        );
    }
}

export default Blocks;