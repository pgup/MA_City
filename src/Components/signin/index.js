import React, { Component } from 'react';
import FormFeild from '../ui/formFields';
import {validate} from '../ui/misc'
import {firebase} from '../../firebase'
class Signin extends Component {

    state = {
        formError:false,
        formSuccess:'',
        formdata:{
            email:{
                element:'input',
                value:'',
                config:{
                    name:'email_input',
                    type:'email',
                    placeholder:'enter your email'
                },
                validation:{
                    required:true,
                    email: true
                },
                valide:false,
                validationMessage:''
            },
            password:{
                element:'input',
                value:'',
                config:{
                    name:'password_input',
                    type:'password',
                    placeholder:'enter your password'
                },
                validation:{
                    required:true
                },
                valide:false,
                validationMessage:''
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

    submitForm(event){
        event.preventDefault();

        let dataToSubmit = {};
        let formIsValid = true;

        for(let key in this.state.formdata){
            dataToSubmit[key] = this.state.formdata[key].value;
            formIsValid = this.state.formdata[key].valid && formIsValid;
        }


        if(formIsValid){
            
            firebase.auth()
            .signInWithEmailAndPassword(
                dataToSubmit.email, 
                dataToSubmit.password
                ).then(()=>{
                    this.props.history.push('/dashboard')
                }).catch(error=>{
                    this.setState({
                        formError:true
                    })
                })
        } else {
            this.setState({
                formError:true
            })
        }



    }

    render() {
        return (
            <div className="container">
                <div className="signin_wrapper" style={{margin:'100px'}}>
                    <form onSubmit={(event)=> this.submitForm(event)}>
                    <h2>Pleace Login</h2>
                    <FormFeild
                                id={"email"}
                                formdata={this.state.formdata.email}
                                change={(element)=> this.updateForm(element)}
                            />
                    <FormFeild
                                id={"password"}
                                formdata={this.state.formdata.password}
                                change={(element)=> this.updateForm(element)}
                            />
                            {
                                this.state.formError ?
                                <div className="error_label">Something is wrong, try again</div>
                                :null
                            }
                    <button onClick={(event)=>this.submitForm(event)}>Log In</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signin;