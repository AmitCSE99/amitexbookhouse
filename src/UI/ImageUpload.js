import classes from "./ImageUpload.module.css";
import { useRef,useState,useEffect } from "react";
const ImageUpload = (props) => {
    const [file,setFile]=useState();
    const [previewUrl,setPreviewUrl]=useState();
    const [isValid,setIsValid]=useState(false);
  const filePickerRef = useRef();

  useEffect(()=>{
      if(!file){
          return;
      }
      const fileReader=new FileReader();
      fileReader.onload=()=>{
          setPreviewUrl(fileReader.result)
      }
      fileReader.readAsDataURL(file)
  },[file])

  const pickedHandler=event=>{
      let pickedFile
      let fileIsValid=isValid;
    if(event.target.files&&event.target.files.length===1){
        pickedFile=event.target.files[0];
        setFile(pickedFile);
        setIsValid(true);
        fileIsValid=true;
    }else{
        setIsValid(false)
        fileIsValid=false;
    }
    console.log(pickedFile);
    props.onInput(props.id,pickedFile,fileIsValid);
  }

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div>
      <input
        id={props.id}
        ref={filePickerRef}
        type="file"
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      ></input>
      <div className={classes.container}>
        <div className={classes.imagePreview}>
          {previewUrl&& <img src={previewUrl} alt="Preview"></img>}
          {!previewUrl&&<p>Please pick an image</p>}
        </div>
        <button type="button" onClick={pickImageHandler}>Pick Image</button>
      </div>
      {!isValid&&<p>{props.errorText}</p>}
    </div>
  );
};
export default ImageUpload;
