import React, {useState, useEffect, useContext, createContext} from 'react';
import Notification from '../components/Notification'

interface NotifContextType {
    showNotif: (message: string, type: 'success' | 'fail' | 'other') => void,
}

//create context!!! to be used in consumer
const NotifContext = createContext<NotifContextType | undefined>(undefined);

//custom provider component for consumers
export function NotifProvider({children} : {children : React.ReactNode}) {
    const [visible, setVisible] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [type, setType] = useState<'success' | 'fail' | 'other'>("other");
    
   
    //show notification
    const showNotif = (notifMessage: string, type: 'other' | 'success' | 'fail'): void => {
        
        //show the notification component
        setVisible(true);
        setMessage(notifMessage);
        setType(type);

        //second parameter of setTimeout is the millisecond delay before executing hte code
        //https://www.geeksforgeeks.org/javascript/settimeout-in-javascript/
        setTimeout(() => {
            setVisible(false);
        }, 3000);

    
    }
    
    //return provider
    return (
        <NotifContext.Provider value={{showNotif}}>
            {children}
            {/* this will mean that theres a notification EVERYWHERE. just depends if we decide to show it or not.
                idk if this is bad practise. */}
            {visible && 
                <div onClick={() => setVisible(false)}><Notification message={message} type={type}/></div>
            }
        </NotifContext.Provider>
    );
  
}

//consumer component (custom hook!)
export function useNotif() {
    //use the context made above
    const context = useContext(NotifContext);

    //CHECK FOR IF ITS UNDEFINED. dont really know if needed here but copying from authContext file
    if (context===undefined) {
        //replace this with notification component
        throw new Error("useNotif must be used within a NotifProvider");
    }

    return context;
}


