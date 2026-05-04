import {IsEmail} from 'class-validator'
// THIS IS AN EXAMPLE based on lectorial 9


//call these in the routes. 
//route.post(validateDto(CreateUserDTO), (req, res) => blah blah)
export class createUserDTO {

    @IsEmail() //needs to pass this
    email: string 
}