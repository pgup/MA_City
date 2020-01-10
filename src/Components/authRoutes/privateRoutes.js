import React from 'react';
import {Route, Redirect} from 'react-router-dom'
const privateRoutes = ({
    user,
    component: Comp,
    ...rest
}) => {
    console.log("=======> ",user)
    // this returns a match which you could find the doc
    //here https://reacttraining.com/react-router/web/api/match
    // react route componet passes three 'render methods' match location
    // and history
    return <Route {...rest} component={(props)=>(
        user ?
            <Comp {...props} user={user}/>
            :
            <Redirect to="/sign_in"/>
    )}/>
};

export default privateRoutes;