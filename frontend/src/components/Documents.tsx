import { useAuth } from '../context/AuthContext'
import {useNotif} from '../context/NotifContext'
import Popup from './Popup'
import Button from './Button'
import { useState } from 'react';
import { User } from "../types/users";
import * as utils from '../utils/utils'

interface DocumentType {
    edit: boolean
}

const Documents = ({edit} : DocumentType) => {
  const {currUser, updateUser} = useAuth();
  const {showNotif} = useNotif();
  const[popup, setPopup] = useState<boolean>(false);

  //states for the data types in - 1 to see if the file has been uploaded,
  //  and 1 to see the actual file
  const [dl, setDL] = useState<File>();
  const [dlStr, setDLStr] = useState<string>(currUser?.drivLic ? currUser?.drivLic : "");

  const [insur, setInsur] = useState<File>();
  const [insurStr, setInsurStr] = useState<string>(currUser?.insur ? currUser?.insur : "");


  // to upload / update documents AND update the currUser + allUsers array.
  const handleSaveDocs = async (currDlStr: string, currInsurStr: string) => {

    if (currUser && currUser.type === "hirer") {
      let updatedUser: User = {...currUser};

      //if the documents are present then prepare to update the user
      if (currDlStr !== "") {
        //console.log("drivers license: " + dlStr);
        updatedUser = {
          ...updatedUser,
          drivLic: currDlStr
        };
      }
      
      if (currInsurStr !== "") {
        updatedUser = {
          ...updatedUser,
          insur: currInsurStr
        };
      }

      if (currDlStr === "" && currInsurStr === "") {
        showNotif("Error! Please upload your documents again!", "fail");
        return;
      }
      else { //update user 
        await updateUser(updatedUser);
        showNotif("Your documents were successfully updated!", "success");
      }
  
    }
  }

  // need to update credibility after uploading documents
  const updateCredibility = (): void => {
        if (currUser) {
            let counter: number = 0;
            if (currUser.drivLic !== "") {
                counter+=2;
            }

            if (currUser.insur !== "") {
                counter+=2;
            }

            const updatedUser: User= {
                ...currUser,
                credibility: counter,
            }

            updateUser(updatedUser);

        }
    }


  return (
    <div>
      <div className="details flex items-center justify-between pl-2 pr-2">
        <div className="flex items-center">
          <h3 className="pr-2">My Documents</h3>
          <img className="hover:drop-shadow w-[15px]" src={"/tooltip.png"} 
              title="Your driver's license must be in JPG format, 
              and your insurance certificate must be in PDF format.
              Please note that Your Business Registration Certificate 
              should be uploaded while applying to hire venues.
              "/>
        </div>
        

        {edit ? 
        (<div >
            <img className="hover:drop-shadow" src={"/edit_square.png"} onClick={() => setPopup(true)}/>

            {popup && 
            <Popup onClose={()=>{
                                  setPopup(false)

                                  //this fixes stale state error (where pressing submit without
                                  //  uploading files shows success notif)
                                  setDLStr("");
                                  setInsurStr("");
                                  setDL(undefined);
                                  setInsur(undefined);
                                  updateCredibility();
                                }}>
              <form onSubmit={(e) => e.preventDefault()} className=' m-auto text-center'>
                <div>
                  <h3 className='mb-2'>Upload and Edit Your Documents</h3>
                </div>

                <div>
                  <label className="">Driver's license</label>
                  <input type="file" accept="image/jpg" 
                         onChange={(e) => {utils.uploadFile(e, dl, setDL, dlStr, setDLStr)}}/>

                </div><br/>

                <div>
                  <label className="">Public Liability Insurance Certificate</label>
                  <input type="file" accept="application/pdf"
                         onChange={(e) => utils.uploadFile(e, insur, setInsur, insurStr, setInsurStr)}/>
                </div><br/>

                <Button onClick={() => handleSaveDocs(dlStr, insurStr)} text="Submit" className="m-5"/>
              </form>
            </Popup>
            }  
          </div>)
        : (<div/>)}
      </div>

      {/* display the user's uploaded documents */}
      <div className="details flex flex-col bg-white border border-[#e0e0e0] rounded-md m-2 p-2">

        <label>Drivers License</label>
        <input disabled value={currUser?.drivLic !== null ? "Uploaded Successfully" : "Not Uploaded"} />
      

        <label>Insurance Certificate</label>
        <input disabled value={currUser?.insur !== null ? "Uploaded Successfully" : "Not Uploaded"} />

        <label>Business Registration Certificate</label>
        <input className="bg-gray-100 text-sm italic" value="Please upload when applying" disabled />
        
      </div>
    </div>
  )
}

export default Documents;