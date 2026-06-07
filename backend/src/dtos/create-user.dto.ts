import {IsEmail, IsString, IsNotEmpty, Contains, Matches} from 'class-validator'
// THIS IS AN EXAMPLE based on lectorial 9

//call these in the routes. 
//route.post(validateDto(CreateUserDTO), (req, res) => blah blah)
export class createUserDTO {

    @IsEmail() //needs to pass this
    @IsNotEmpty()
    @IsString()
    @Contains('@')
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @Contains('0') //needs the 0 at the start
    @Matches(/^[0-9]{10}$/)
    phoneNumber: string;

}