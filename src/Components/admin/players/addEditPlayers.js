import React, { Component } from 'react';
import AdminLayout from '../../../Hoc/AdminLayout'

import FormField from '../../ui/formFields'
import {validate} from '../../ui/misc'

import {firebasePlayers, firebaseDB, firebase} from '../../../firebase';
import Fileuploader from '../../ui/fileuploader'

class AddEditPlayers extends Component {

    state={
        playerId:'',
        formType:'',
        formError:false,
        formSuccess:'',
        defaultImg:'',
        teams:[],
        formdata:{
            name:{
                element:'input',
                value:'',
                config:{
                    label:"Player date",
                    name:'name_input',
                    type:'text',
                },
                validation:{
                    required:true,
                    
                },
                valide:false,
                validationMessage:'',
                showlabel:true
            },
            lastname:{
                element:'input',
                value:'',
                config:{
                    label:"Player Last name",
                    name:'lastname_input',
                    type:'text',
                },
                validation:{
                    required:true,
                    
                },
                valide:false,
                validationMessage:'',
                showlabel:true
            },
            number:{
                element:'input',
                value:'',
                config:{
                    label:"Player number",
                    name:'number_input',
                    type:'text',
                },
                validation:{
                    required:true,
                    
                },
                valide:false,
                validationMessage:'',
                showlabel:true
            },
            position:{
                element:'select',
                value:'',
                config:{
                    label:"select a position",
                    name:'select_position',
                    type:'select',
                    options:[
                        {key:"Keeper",value:"Keeper"},
                        {key:"Defence",value:"Defence"},
                        {key:"Midfield",value:"Midfield"},
                        {key:"Striker",value:"Striker"},
                        
                    ]
                },
                validation:{
                    required:true
                },
                valide:false,
                validationMessage:'',
                showlabel:true
            },
            image:{
                element:'image',
                value:'',
                validation:{
                    required:true
                },
                valid:false
            }
        }
    }
    //updatefields basicaly showes all the value plus pic of the player we clicked on from the players list
    // same name as the state defaultImg but different  variable can use differnt name
    updateFields= (player,playerId,type, defaultImg) =>{
        const newFormdata = {...this.state.formdata}

        for(let key in newFormdata){
            newFormdata[key].value = player[key] //the player = return {name:'jo',lastname:'do',number:'6'}
            //player[key] gives value of firstname, lastname, number 
            //exaple if key = name than player[name]= jo and newformdata[name].value = jo
            newFormdata[key].valid = true
        }
//using es6 we dont need to dot playerId: playerId in setState es6 does it for us
        this.setState({
            playerId,
            defaultImg,
            formType: type,
            formdata: newFormdata
        })

    }

    componentDidMount(){
        const playerId = this.props.match.params.id;

        if(!playerId){
            this.setState({
                formType:'Add Player'
            })
        }else{
            firebaseDB.ref(`players/${playerId}`).once('value')
            .then(snapshot => {
                const playerData = snapshot.val();
//I did this and had problems firebase.storage().app('players') it was ref not app
                firebase.storage().ref('players')
                .child(playerData.image).getDownloadURL()
                .then(url => {
                    this.updateFields(playerData,playerId,'Edit player', url)
                }).catch( e => {
                    //add everything from playerdata but change image to nothing 
                    this.updateFields({
                        ...playerData,
                        image:''
                    
                    },playerId,'Edit player', '')
                })
            })

        }
    }
// content='' default argument es6  
// updateform gets an object with event and id {event,id} than uptates the form value upove
// but in are case we need to update the image value  also the other feilds. however
// the event is that is passed to updateform is usually through input a value in the form feild or selecting options
// but for image we need to store the name of the image inside the image.value
    updateForm(element, content = ''){
        const newFormdata = {...this.state.formdata}
        const newElement = {...newFormdata[element.id]}
        //here if the element is image we store the image not the the value = content is the image filename is just the name of picture see 
        //line 31 fileuploader.js
        if(content === '') {
            newElement.value = element.event.target.value
        } else {
            newElement.value = content
        }
        


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

    successForm = (message) => {
        this.setState({
            formSuccess: message
        });
        setTimeout(() => {
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

        
        
        if(formIsValid){
            if(this.state.formType === 'Edit player'){

                firebaseDB.ref(`players/${this.state.playerId}`)
                .update(dataToSubmit).then(()=>{
                    this.successForm('Update correctly');
                }).catch(e=>{
                    this.setState({formError:true})
                })
            }else{
                firebasePlayers.push(dataToSubmit).then(()=>{
                    this.props.history.push('/admin_players')
                }).catch(e=>{
                    this.setState({
                        formError:true
                    })
                })
            }
        } else {
            this.setState({
                formError:true
            })
        }



    }
    
    resetImage =() => {
        const newFormdata = {...this.state.formdata}
        newFormdata['image'].value = '';
        newFormdata['image'].valid = false;
        this.setState({
            defaultImg:'',
            formdata: newFormdata
        })
    }

    storeFilename = (filename) => {
        this.updateForm({id:'image'}, filename)
    }
/*
    <FormField
                                    dir="players"
                                    tag={"Player image"}
                                    defaultImg={this.state.defaultImg}
                                    defaultImgName={this.state.formdata.image.value}
                                    resetImage={()=> this.resetImage()}
                                />
*/
    render() {
        console.log("state change in addeditplayers",this.state.formdata)
        return (
            <AdminLayout>
                <div className="editplayers_dialog_wrapper">
                    <h2>
                        {this.state.formType}
                    </h2>
                    <div>
                        <form onSubmit={(event) => this.submitForm(event)}>
                        <Fileuploader
                                    dir="players"
                                    tag={"Player image"}
                                    defaultImg={this.state.defaultImg}
                                    defaultImgName={this.state.formdata.image.value}
                                    resetImage={()=> this.resetImage()}
                                    filename={(filename)=> this.storeFilename(filename)}
                                />
                                {/* filename get an event */}
                            <FormField
                                    id={"name"}
                                    formdata={this.state.formdata.name}
                                    change={(element)=> this.updateForm(element)}
                                />
                            <FormField
                                    id={"lastname"}
                                    formdata={this.state.formdata.lastname}
                                    change={(element)=> this.updateForm(element)}
                                />
                            <FormField
                                    id={"number"}
                                    formdata={this.state.formdata.number}
                                    change={(element)=> this.updateForm(element)}
                                />
                            <FormField
                                    id={"position"}
                                    formdata={this.state.formdata.position}
                                    change={(element)=> this.updateForm(element)}
                                />

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

export default AddEditPlayers;