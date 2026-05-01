// references:
// FSD Lab 7 and 8
// https://typeorm.io/docs/help/decorator-reference/

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm'
import { User } from './User'
import {Application} from './Application'
import {ShortlistedVenue} from './ShortlistedVenue'
import {Unavailable} from './Unavailable'

//can say what table this entity is based on
@Entity({name: "venues"})

export class Venue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true }) //talk to ananya abt this
    name: string;

    @Column()
    phone: string;

    @Column({unique: true})
    email: string;

    @Column()
    suburb: string;

    @Column()
    state: "VIC" | "TAS" | "ACT" | "SA" | "WA" | "NSW" | "QLD" | "NT" ;

    @Column({
        type: "int",
        length: 4
    })
    postcode: number;

    @Column()
    capacity: number;

    @Column()
    rate: number;

    @Column()
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