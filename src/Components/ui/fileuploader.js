import React, { Component } from 'react';
import FileUploader from "react-firebase-file-uploader";
import CircularProgress from '@material-ui/core/CircularProgress';
import {firebase} from '../../firebase';

class Fileuploader extends Component {


    state = {
        name:'',
        isUploading:false,
        fileURL:''
    }

    

  handleUploadStart = () => this.setState({ isUploading: true});

  handleUploadError = () => {
    this.setState({ isUploading: false });
    
  };

  handleUploadSuccess = filename => {

    
      this.setState({
          name:filename,
          isUploading:false
      });
//url gives as a link to the picture while filename is just the name of the pic
      firebase.storage().ref(this.props.dir)
      .child(filename).getDownloadURL()
      .then(url => {

        this.setState({fileURL: url})
      })

      this.props.filename(filename)
  }

    static getDerivedStateFromProps(props,state){
        if(props.defaultImg){
            return state = {
                name:props.defaultImgName,
                fileURL:props.defaultImg
            }
        }
        return null
    }


    uploadAgain = () => {
        this.setState({
            name:'',
            isUploading:false,
            fileURL:''
        });

        this.props.resetImage();
    }
/*
<FileUploader
                                accept="image/*"
                                name="image"
                                randomizeFilename
                                storageRef={firebase.storage().ref(this.props.dir)}
                                onUploadStart={this.handleUploadStart}
                                onUploadError={this.handleUploadError}
                                onUploadSuccess={this.handleUploadSuccess}
                               
                            
                            />
*/
    render() {
        
        return (
            //if we dont have a file url show fileuploader
            // {console.log("this.props.dir ====>",this.props.dir)}
            // this call onUploadSuccess={(event)=>console.log("event====", event)} return filename 5c8e310d-3b3f-4cc6-a609-090505a6e668.png
            // onUploadSuccess is an event like onChange or onClick  so the event is passed to the funciton{this.handleUploadSuccess} by efualut 
            
            <div>
                
                {
                    !this.state.fileURL ?
                        <div>
                            <div className="label_inputs">{this.props.tag}</div>
                            <FileUploader
                                accept="image/*"
                                name="image"
                                randomizeFilename
                                storageRef={firebase.storage().ref(this.props.dir)}
                                onUploadStart={this.handleUploadStart}
                                onUploadError={this.handleUploadError}
                                onUploadSuccess={this.handleUploadSuccess}
                               
                            
                            />

                        </div>
                    :
                    null

                }
                {
                    this.state.isUploading ?
                    <div className="progress"
                        style={{textAlign:'center',margin:'30px 0'}}
                    >
                        <CircularProgress
                            style={{color:'#98c6e9'}}
                            thickness={7}
                        />
                    </div>
                    :
                    null
                }
               {
                   this.state.fileURL ?
                   <div className="image_upload_container ">
                       <img
                            style={{
                                width:'100%'
                            }}
                            src={this.state.fileURL}
                            alt={this.state.name}
                       />
                       <div className="remove" onClick={()=>this.uploadAgain()}>
                           Remove
                       </div>
                   </div>
                   :
                   null
               }
            </div>
        );
    }
}

export default Fileuploader;