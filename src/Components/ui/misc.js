import React from 'react'
import {Link}  from 'react-router-dom'

export const Tag = (props) => {
    const template = <div 
        style={{
            background: props.bck,
            fontSize: props.size,
            color: props.color,
            padding: '5px 10px',
            display: 'inline-block',
            fontFamily: 'Righteous',
            ...props.add
        }}
    >{props.children}</div>

    if(props.link){
        return (
            <Link to={props.linkto}>
                {template}
            </Link>
        )
    } else {
        return template
    }
}
/**
 * // childSnapshot.val(),  returns object but we want new object with those values + id like this ({ name:'',shortName:''...id:''}) 
            //if we did {vvv:childSnapshot.val()} it would create object within an object {vvv:{},id:""}
 */
export const firebaseLooper = (snapshot) => {
    const data = [];
    console.log("snapshot ==",snapshot)
    snapshot.forEach((childSnapshot)=>{
        data.push({
            ...childSnapshot.val(), // childSnapshot.val(),  returns object but we want new object with those values + id({ name:'',shortName:''...id:''}) 
            //if we did {vvv:childSnapshot.val()} it would create object within an object {vvv:{},id:""}
            id: childSnapshot.key
        })
    });
    console.log("data ==",data)
    return data
}

export const reverseArray = (actualArray) => {
    let reversedArray = [];

    for(let i = actualArray.length-1; i>=0; i--){
        reversedArray.push(actualArray[i])
    }
    return reversedArray
}

export const validate = (element) => {

    let error = [true,''];

    if(element.validation.email){
        const valid = /\S+@\S+\.\S+/.test(element.value)
        const message = `${!valid ? 'Must be valid email':''}`;
        error = !valid ? [valid,message]: error 
    }

    if(element.validation.required){
        const valid = element.value.trim() !== ''; 
        const message = `${!valid ? 'This field is required':''}`;
        error = !valid ? [valid,message]: error 
    }

    return error;

}