import React, { Component } from 'react';
import AdminLayout from '../../../Hoc/AdminLayout'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';

import { firebasePlayers } from '../../../firebase'
import { firebaseLooper, reverseArray } from '../../ui/misc'

class AdminPlayers extends Component {
    state = {
        isloading: true,
        players: []
    }

    componentDidMount() {
        firebasePlayers.once('value').then(snapshot => {
            // for each snapshot call looper because snapshot gives us lots of other data but
            //looper gets as the value and the id 
            //then store the value in array
            const matches = firebaseLooper(snapshot);


            this.setState({
                isloading: false,
                players: reverseArray(matches)// we used this revers because there was a data associated with it but not now
            })

        })
    }

    render() {
        return (
            <AdminLayout>
                <div>
                    <Paper>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell>First className</TableCell>
                                    <TableCell align="right">Last Name</TableCell>
                                    <TableCell align="right">Number</TableCell>
                                    <TableCell align="right">Position</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {this.state.players ?
                                    this.state.players.map((player, i) => (

                                        <TableRow>
                                            <TableCell>
                                                <Link to={`/admin_players/add_players/${player.id}`}>
                                                    {player.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Link to={`/admin_players/add_players/${player.id}`}>
                                                    {player.lastname}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right">
                                                
                                                    {player.number}
                                                
                                            </TableCell>
                                            <TableCell align="right">
                                                
                                                    {player.position}
                                                
                                            </TableCell>
                                        </TableRow>

                                    ))
                                    :
                                    null
                                }

                            </TableBody>
                        </Table>
                    </Paper>
                    <div className='admin_progress'>
                        {
                            this.state.isloading ?
                                <CircularProgress thickness={7} style={{ color: '#98c5e9' }} />
                                : ''
                        }
                    </div>
                </div>
            </AdminLayout>
        );
    }
}

export default AdminPlayers;