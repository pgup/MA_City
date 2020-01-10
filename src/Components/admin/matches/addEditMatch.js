import React, { Component } from 'react';
import AdminLayout from '../../../Hoc/AdminLayout'

import FormField from '../../ui/formFields'
import {validate} from '../../ui/misc'

import {firebaseTeams, firebaseDB, firebaseMatches} from '../../../firebase';
import { firebaseLooper} from '../../ui/misc'

class AddEditMatch extends Component {

    state = {
        matchId:'',
        formType:'',
        formError:false,
        formSuccess:'',
        teams:[],
        formdata:{
            date:{
                element:'input',
                value:'',
                config:{
                    label:"Event date",
                    name:'date_input',
                    type:'date',
                },
                validation:{
                    required:true,
                    //email: true
                },
                valide:false,
                validationMessage:'',
                showlabel:true
            },
            local:{
                element:'select',
                value:'',
                config:{
                    label:"select a local team",
                    name:'select_input',
                    type:'select',
                    options:[]
                },
                validation:{
                    required:true
                },
                valide:false,
                validationMessage:'',
                showlabel:false
            },
            resultLocal:{
                element:'input',
                value:'',
                config:{
                    label:"Result date",
                    name:'result_local_input',
                    type:'text',
                },
                validation:{
                    required:true,
                    
                },
                valide:false,
                validationMessage:'',
                showlabel:false
            },

            away:{
                element:'select',
                value:'',
                config:{
                    label:"select a local team",
                    name:'select_input',
                    type:'select',
                    options:[]
                },
                validation:{
                    required:true
                },
                valide:false,
                validationMessage:'',
                showlabel:false
            },
            resultAway:{
                element:'input',
                value:'',
                config:{
                    label:"Result date",
                    name:'result_local_input',
                    type:'text',
                },
                validation:{
                    required:true,
                   
                },
                valide:false,
                validationMessage:'',
                showlabel:false
            },
            referee:{
                element:'input',
                value:'',
                config:{
                    label:"Referee",
                    name:'referee_input',
                    type:'text',
                },
                validation:{
                    required:true,
                   
                },
                valide:false,
                validationMessage:'',
                showlabel:true
            },
            stadium:{
                element:'input',
                value:'',
                config:{
                    label:"Stadium",
                    name:'stadium_input',
                    type:'text',
                },
                validation:{
                    required:true,
                   
                },
                valide:false,
                validationMessage:'',
                showlabel:true
            },
            result:{
                element:'select',
                value:'',
                config:{
                    label:"Team result",
                    name:'select_result',
                    type:'select',
                    options:[
                        {key:"W",value:"W"},
                        {key:"L",value:"L"},
                        {key:"D",value:"D"},
                        {key:"n/a",value:"n/a"}
                    ]
                },
                validation:{
                    required:true
                },
                valide:false,
                validationMessage:'',
                showlabel:true
            },
            final:{
                element:'select',
                value:'',
                config:{
                    label:"Game played ?",
                    name:'select_played',
                    type:'select',
                    options:[
                        {key:"Yes",value:"Yes"},
                        {key:"No",value:"No"}
                    ]
                },
                validation:{
                    required:true
                },
                valide:false,
                validationMessage:'',
                showlabel:true
            }
        }
    }

    updateForm(element){
        const newFormdata = {...this.state.formdata}
        const newElement = {...newFormdata[element.id]}

        newElement.value = element.event.target.value


        let valiData = validate(newElement)
        newElement.valid = valiData[0];
        newElement.validationMessage = valiData[1]

        console.log(valiData)

        newFormdata[element.id] = newElement

        this.setState({
            formError:false,
            formdata:newFormdata
        })
    }

    updateFields(match,teamOptions,teams,type,matchId){
        const newFormdata = {
            ...this.state.formdata
        }

        for(let key in newFormdata){
            if(match){
                newFormdata[key].value = match[key];
                newFormdata[key].valid = true;
            }
            if(key === 'local' || key === 'away'){
                newFormdata[key].config.options = teamOptions
            }

        }

        this.setState({
            matchId,
            formType:type,
            formdata: newFormdata,
            teams
        })

    }

    componentDidMount(){
        //check out the privateRoute.js the react Router passes props which has match.params.id gives the id.
        const matchId = this.props.match.params.id
        const getTeams = (match, type) => {
            firebaseTeams.once('value').then((snapshot)=>{
                //console.log("before looper  ",snapshot)
                const teams = firebaseLooper(snapshot);
                //console.log("after looper  ", teams)
                const teamOptions = []; //options we pass wot select

                snapshot.forEach((childSnapshot)=>{
                    teamOptions.push({
                        key: childSnapshot.val().shortName,
                        value: childSnapshot.val().shortName
                    })

                });
                //console.log("match  ", match)
                this.updateFields(match,teamOptions,teams,type,matchId)
              
            })
        }


        if(!matchId){
            //ADD Match
            getTeams(false, 'Add Match')
        } else {
            firebaseDB.ref(`matches/${matchId}`).once('value')
            .then((snapshot)=>{
               // console.log(snapshot)
                 const match = snapshot.val();//this match is not the same as (Router match)
                 //this match return the match with the matchid
                // console.log(match)
            
                getTeams(match, 'Edit Match')
                 /**
                *           the match  returns
                            {away: "Man.City", awayThmb: "manchester_city", date: "2018-06-02", final: "Yes", local: "Liverpool", …}
                            =====>when we expant the above object we get,  all those are the object above at the state
                            next we call updateFeils and update each fiels based on the match we got from matchid
                            away: "Man.City"
                            awayThmb: "manchester_city"
                            date: "2018-06-02"
                            final: "Yes"
                            local: "Liverpool"
                            localThmb: "liverpool"
                            referee: "Hector Pitana"
                            result: "W"
                            resultAway: "3"
                            resultLocal: "1"
                            stadium: "Wolfer Stdium"
                */
               // 
            })
        }
    }

    successForm(message){
        this.setState({
            formSuccess: message
        })

        setTimeout(()=>{
            this.setState({
                formSuccess:''
            })
        },2000)
    }

    submitForm(event){
        event.preventDefault();

        let dataToSubmit = {};
        let formIsValid = true;

        for(let key in this.state.formdata){
            dataToSubmit[key] = this.state.formdata[key].value;
            formIsValid = this.state.formdata[key].valid && formIsValid;
        }

        this.state.teams.forEach((team)=>{
            if(team.shortName === dataToSubmit.local){
                dataToSubmit['localThmb'] = team.thmb
            }
            if(team.shortName === dataToSubmit.away){
                dataToSubmit['awayThmb'] = team.thmb
            }
        })
        
        if(formIsValid){
            if(this.state.formType === 'Edit Match'){
                firebaseDB.ref(`matches/${this.state.matchId}`)
                .update(dataToSubmit).then(()=>{
                    this.successForm('Updated correctly')
                }).catch((e)=>{
                    this.setState({formError: true})
                })
            } else {
                firebaseMatches.push(dataToSubmit).then(()=>{
                    this.props.history.push('/admin_matches');
                }).catch((e)=>{
                    this.setState({formError:true})
                })
            }
        } else {
            this.setState({
                formError:true
            })
        }



    }

    render() {
        return (
            <AdminLayout>

                <div className="editmatch_dialog_wrapper">
                    <h2>
                        {this.state.formType}
                    </h2>
                    <div>
                        <form onSubmit={(event)=> this.submitForm(event)}>
                        <FormField
                                id={"date"}
                                formdata={this.state.formdata.date}
                                change={(element)=> this.updateForm(element)}
                            />
 
                        <div className="select_team_layout">
                            <div className="label_inputs">Local</div>
                            <div className="wrapper">
                                <div className="left">
                                        <FormField
                                            id={"local"}
                                            formdata={this.state.formdata.local}
                                            change={(element) => this.updateForm(element)}
                                        />
                                </div>
                                <div>
                                <FormField
                                            id={"resultLocal"}
                                            formdata={this.state.formdata.resultLocal}
                                            change={(element) => this.updateForm(element)}
                                        />
                                </div>
                            </div>
                        </div>   

                        <div className="select_team_layout">
                            <div className="label_inputs">Away</div>
                            <div className="wrapper">
                                <div className="left">
                                        <FormField
                                            id={"away"}
                                            formdata={this.state.formdata.away}
                                            change={(element) => this.updateForm(element)}
                                        />
                                </div>
                                <div>
                                <FormField
                                            id={"resultAway"}
                                            formdata={this.state.formdata.resultAway}
                                            change={(element) => this.updateForm(element)}
                                        />
                                </div>
                            </div>
                        </div>  
                        
                        
                        <div className="split_fields">
                            <FormField
                                                id={"referee"}
                                                formdata={this.state.formdata.referee}
                                                change={(element) => this.updateForm(element)}
                                            />
                            <FormField
                                                id={"stadium"}
                                                formdata={this.state.formdata.stadium}
                                                change={(element) => this.updateForm(element)}
                                            />
                        </div>

                        <div className="split_fields last">
                            <FormField
                                                id={"result"}
                                                formdata={this.state.formdata.result}
                                                change={(element) => this.updateForm(element)}
                                            />
                            <FormField
                                                id={"final"}
                                                formdata={this.state.formdata.final}
                                                change={(element) => this.updateForm(element)}
                                            />                                            
                            
                        </div>

                        <div className="sucess_label">{this.state.formSuccess}</div>
                        {
                            this.state.formError ? 
                            <div className="error_label">
                                Something is wrong
                            </div>
                            :
                            ''
                        }
                        <div className='admin_submit'>
                            <button onClick={(event)=> this.submitForm(event)}>
                                {this.state.formType}
                            </button>
                        </div>

                        </form>
                    </div>
                </div>

                
            </AdminLayout>
        );
    }
}

export default AddEditMatch;