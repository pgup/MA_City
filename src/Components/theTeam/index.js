import React, { Component } from 'react';
import PlayerCard from '../ui/playerCard';
import Fade from 'react-reveal/Fade';

import Stripes from '../../Resources/images/stripes.png'
import { firebasePlayers, firebase } from '../../firebase';
import { firebaseLooper } from '../ui/misc';
import { Promise } from 'core-js';
import { resolve } from 'path';
import { reject } from 'q';

class TheTeam extends Component {

    state = {
        loading: true,
        players: []
    }
    /*
    const arrayvalue = []
    snapshot.foreach((childSnapshot )=> ...childSnapshot.val(),id)
    */
    componentDidMount() {
        firebasePlayers.once('value').then(snapshot => {
            const players = firebaseLooper(snapshot);
            //players retur [{},{},{}] {}={image:'.....png',lasname:'',name:'',}

            let promises = [];
            // console.log("the _teams",players)
            // for (let key in players) {
            //     console.log("Key ",players[key].image)  
            // }
            
             for (let key in players) {
                //we loop through the player and than we will have twenty different promises.
                promises.push(
                    new Promise((resolve, reject) => {
                             firebase.storage().ref('players')
                            .child(players[key].image).getDownloadURL()
                            .then(url => {
                                //we add new property url
                                players[key].url = url;
                                //console.log("players[key].url  ", players[key].url , "url ==", url)
                                resolve();
                            })
                    })
                )
            }
            

            //when all the promises are done then do the following
            
            Promise.all(promises).then(() => {
                this.setState({
                    loading: false,
                    players
                })
            })
            
            
        })
    }

    showplayersByCategory = (category) => (
        // console.log("this.state.players",this.state.players)
        // this.state.players.map((item,i)=>
        // console.log("item",item.position === category)
        // )

        this.state.players ?
            this.state.players.map((item, i) => {

                return item.position === category ?
                    (<Fade left key={i}>
                        <div className="item">
                            <PlayerCard

                                number={item.number}
                                name={item.name}
                                lastname={item.lastname}
                                bck={item.url}

                            />
                        </div>
                    </Fade>)
                    :
                    null
            }) :
            null


    )

    render() {
        //console.log("the _teams",this.state.players)
        return (
            <div className="the_team_container"
                style={{
                    background:`url(${Stripes})`
                }}
            >
            {
                !this.state.loading ?
                        <div>
                            <div className="team_category_wrapper">
                                <div className="title">Keepers</div>
                                <div className='team_cards'>
                                    {this.showplayersByCategory('Keeper')}
                                </div>

                            </div>
                            <div className="team_category_wrapper">
                                <div className="title">Defence</div>
                                <div className='team_cards'>
                                    {this.showplayersByCategory('Defence')}
                                </div>

                            </div>
                            <div className="team_category_wrapper">
                                <div className="title">Midfield</div>
                                <div className='team_cards'>
                                    {this.showplayersByCategory('Midfield')}
                                </div>

                            </div>
                            <div className="team_category_wrapper">
                                <div className="title">Striker</div>
                                <div className='team_cards'>
                                    {this.showplayersByCategory('Striker')}
                                </div>

                            </div>
                            
                        </div>
                :
                    null
            }
                
            </div>
        );
    }
}

export default TheTeam;