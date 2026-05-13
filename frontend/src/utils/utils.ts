import React from 'react'

// FUNCTION: gets the current date and returns it as a string-----------------------------------------------
export function getCurrDate(): string {
  const now: Date = new Date();

  const currMonth: string = String(now.getMonth() + 1).padStart(2, '0');
  const currDay: string = String(now.getDate()).padStart(2, '0');
  const currDate: string = `${now.getFullYear()}-${currMonth}-${currDay}`;

  return currDate;
}

// FUNCTION: takes 2 string date inputs, and finds the elapsed time, returning it as a strin in format HH:MM--- 
export function elapsedTime(startTime: string, endTime: string): string {
  const startHour: number = Number(startTime.split(':')[0]);
  const startMin: number = Number(startTime.split(':')[1]);

  const endHour: number = Number(endTime.split(':')[0]);
  const endMin: number = Number(endTime.split(':')[1]);

  const totalTime: number = (endHour * 60 + endMin) - (startHour * 60 + startMin);
  const totalHours: string = Math.floor(totalTime / 60).toString();
  const totalMins: string = (totalTime % 60).toString().padStart(2, '0');

  return `${totalHours}:${totalMins}`;

}

//FUNCTION: compare the date now with another date (parameter)-----------------------------------------------
//RETURNS: returns true if the input date is before the current date (date is in the past)
//         returns false if the input date is after the current date (date is in the future)
export function compareTime(inputTime: string): boolean {

  const currDate: string = getCurrDate();

  if (currDate < inputTime) {
    return false;
  }
  else {
    return true;
  }

}


// upload a file
// source: https://pqina.nl/blog/convert-a-file-to-a-base64-string-with-javascript
// is called on upload of a file to the input field - use the onChange attribute on your input field
// INPUT FIELDS : e, file and setFile is the state var combo (var, updater fn) for storing the FILE, 
              // fileStr and setFileStr is the state var combo (var, updater fn) for storing the BASE64 STRING
              // bad practice to put type any but idk what to do abt the updater functions
export function uploadFile(e: React.ChangeEvent<HTMLInputElement>, file: File | undefined, setFile: any, fileStr: string, setFileStr: any) {
  if (e.target.files && e.target.files.length > 0) {
    // get the file uploaded - it will always be at 0, even if there are multiple input fields
    setFile(e.target.files[0]);

    //console.log("file is " + file);

    // make sure that it is uploaded properly
    if (e.target.files[0] !== undefined) {
      const read = new FileReader();
      // convert the file to a base64 string
      read.onloadend = () => {
        const result = (read.result as string);
        // store the result
        setFileStr(result);
        // testing
        //console.log("result:\n" + result);
      }
      // return a data url
      read.readAsDataURL(e.target.files[0]);
    }
  }
}
//------------------------------------------------------------------------------------------------
