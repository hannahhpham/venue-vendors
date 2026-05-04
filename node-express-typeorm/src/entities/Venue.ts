// references:
// FSD Lab 7 and 8
// https://typeorm.io/docs/help/decorator-reference/

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm'
import { User } from './User'
import {Application} from './Application'
import {ShortlistedVenue} from './ShortlistedVenue'
import {Unavailable} from './Unavailable'
//there are lots of decorators like IsString() IsNotEmpty()
import {IsEmail} from 'class-validator'

//can say what table this entity is based on
@Entity({name: "venues"})

export class Venue {
    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    @Column({ unique: true }) //talk to ananya abt this
    name: string;

    @Column({type: "varchar", length: 15})
    phone: string;

    @Column({type: "varchar", length: 15, unique: true})
    @IsEmail() //first test with class-validator. NEED TO LEARN MORE
    email: string;

    @Column({type: "varchar", length: 30})
    suburb: string;

    @Column({type: "varchar", length: 3})
    state: "VIC" | "TAS" | "ACT" | "SA" | "WA" | "NSW" | "QLD" | "NT" ;

    @Column({type: "int", length: 4})
    postcode: number;

    @Column({type: "int", length: 5})
    capacity: number;

    @Column({type: "int", length: 5})
    rate: number;

    @Column({type: "text"})
    description: string;

    //IMPORTANT!!! check over this. 
    //this will add a new column
    //logic: each venue is owned by 1 user. 
    
    //might need @JoinColumn
    @ManyToOne(() => User, (user) => user.venues)
    @JoinColumn({
        name: "ownerID", //name in venues tab;e
        referencedColumnName: "id", //name in users table
        foreignKeyConstraintName: "FK_venues_userID", //constraint name in venues table
    })
    user: User;

    //logic: each application has 1 venue
    //for applications. again, how do we make this optional
    @OneToMany(()=> Application , (application)=> application.venue)
    applications: Application []

    //for the shortlisted venues
    @OneToMany(()=>ShortlistedVenue, (shortlistedVenue)=> shortlistedVenue.venue)
    shortlistedVenues: ShortlistedVenue[]

    //for the unavailable timeslots
    //for the shortlisted venues
    @OneToMany(()=>Unavailable, (unavailable)=> unavailable.venue)
    unavailable: Unavailable[]
   
}