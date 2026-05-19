import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {useNotif} from '../context/NotifContext'
import Popup from './Popup'
import Button from './Button'


interface detailsType {
    edit: boolean
}


const Details = ({edit} : detailsType) => {
  const {currUser, updateUser} = useAuth();
  const {showNotif} = useNotif();
  const[popup, setPopup] = useState<boolean>(false);

  //states for the data types in. weird intialisation is so prefill works
  const[firstName, setFirstName] = useState<string>(currUser?.firstName || "");
  const[lastName, setLastName] = useState<string>(currUser?.lastName || "");
  const[phoneNumber, setPhoneNumber] = useState<string>(currUser?.phoneNumber || "");

  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();
    handleEdit(firstName, lastName, phoneNumber);
  }

    const handleEdit = (firstName: string, lastName: string, phoneNumber: string) => {
    if (currUser) {

      //new stuff: u can create an updated variable by using old variable's data
      const updatedUser = {
        ...currUser, //takes previous data stored in the old currUser object
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber
      }
      //update local storage and states with new values using function from authcontext
      //needs to be in authcontext cuz thats where the state for currUser and allUsers is
      updateUser(updatedUser);
      showNotif("Details successfully updated", 'success');
    }
  }

  return (
    <div>
      <div className="details flex items-center justify-between pl-2 pr-2">
        <h3>My Details</h3>

        {edit ? 
        (<div >
            <img className="hover:drop-shadow" src={"/edit_square.png"}
             onClick={() => setPopup(true)}/>

            {popup && 
            <Popup onClose={()=>setPopup(false)}>
              <form onSubmit={handleSubmit} className='h-100 m-auto text-center'>
                <div>
                  <h3 className='mb-2'>Edit Your Details</h3>
                </div>

                <div>
                  <label className="">First Name</label>
                  <input value={firstName} 
                        onChange={(e)=> {setFirstName(e.target.value)}} 
                        pattern="[A-Za-z]+" type="text" required>
                          {/* pattern is really cool html validation!! */}
                  </input>
                </div><br/>

                <div>
                  <label className="">Last Name</label>
                  <input value={lastName}
                        onChange={(e)=> {setLastName(e.target.value)}} type="text" 
                        pattern="[A-Za-z]+" required>
                  </input>
                </div><br/>

                <div>
                  <label className="">Phone Number</label>
                  <input value={phoneNumber} pattern="[0-9]{10}"
                        onChange={(e)=> {setPhoneNumber(e.target.value)}} type="text" required>
                  </input>
                </div>

                <Button text="Submit" className="m-5"/>
              </form>
              
            </Popup>
            }  
          </div>)
        : (<div/>)}
      </div>

      <div className="details flex flex-col bg-white border border-[#e0e0e0] rounded-md m-2 p-2">

        <label>First Name</label>
        <input value={currUser?.firstName} disabled></input>
      

        <label>Last Name</label>
        <input  value={currUser?.lastName} disabled></input>

        <label>Phone Number</label>
        <input value={currUser?.phoneNumber} disabled></input>

        {/* add non-editable fields as per the user stories sheet */}
        <label>Email</label>
        <input className="bg-gray-100 text-sm italic" value={currUser?.email} disabled></input>
        
        <label>Password</label>
        <input className="bg-gray-100 text-sm italic" value={currUser?.password} disabled></input>
        
        
      </div>
    </div>
  )
}

export default Details
