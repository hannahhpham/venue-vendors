// references:
// FSD Lab 7 and 8
// https://typeorm.io/docs/help/decorator-reference/

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm'
import { User } from './User'
import { Application } from './Application'
import { ShortlistedVenue } from './ShortlistedVenue'
import { Unavailable } from './Unavailable'
//there are lots of decorators like IsString() IsNotEmpty()
// I think we gotta move these into the dtos
import { IsEmail } from 'class-validator'


// adapt for SQLite Testing
const isTesting = process.env.NODE_ENV === "test";


//can say what table this entity is based on
@Entity({name: "venues"})

export class Venue {
    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({type: "varchar", length: 15})
    phone: string;

    @Column({type: "varchar", length: 35, unique: true})
    @IsEmail()
    email: string;

    @Column({type: "varchar", length: 75})
    address: string;

    @Column({type: "varchar", length: 30})
    suburb: string;

    @Column({type: "varchar", length: 3})
    state: "VIC" | "TAS" | "ACT" | "SA" | "WA" | "NSW" | "QLD" | "NT" ;

    // tried putting length property on this but it didn't work
    @Column({type: "int"})
    postcode: number;

    @Column({type: "int"})
    capacity: number;

    @Column({type: "int"})
    rate: number;

    @Column({type: "text"})
    description: string;

    @Column({type: "int"})
    ownerID: number;

    @Column({type: "text", nullable: true})
    suitability: string | null;

    @Column({
        type: isTesting ? "boolean" : "bit",
        nullable: true
    })
    isFeatured?: boolean;

    //IMPORTANT!!! check over this. 
    //this will add a new column
    //logic: each venue is owned by 1 user. 

    // CHECK: WHAT DOES THE foreignKeyConstraintName mean??
    
    //might need @JoinColumn
    @ManyToOne(() => User, (user) => user.venues, {nullable: false})
    @JoinColumn({
        name: "ownerID", //name in venues tab;e
        referencedColumnName: "id", //name in users table
        foreignKeyConstraintName: "FK_venues_userID", //constraint name in venues table
    })
    vendor: User;

    //logic: each application has 1 venue
    //for applications. again, how do we make this optional
    @OneToMany(()=> Application , (application) => application.venue)
    applications: Application[]

    //for the shortlisted venues
    @OneToMany(()=>ShortlistedVenue, (shortlistedVenue) => shortlistedVenue.venue)
    shortlistedVenues: ShortlistedVenue[]

    //for the unavailable timeslots
    //for the shortlisted venues
    @OneToMany(()=>Unavailable, (unavailable) => unavailable.venue)
    unavailable: Unavailable[]
   
}