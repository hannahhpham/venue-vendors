//all entity files have used lab 8 as a reference
import { Entity,
     PrimaryGeneratedColumn,
      Column, CreateDateColumn,
       UpdateDateColumn, OneToMany} from 'typeorm'
import {Venue} from './Venue'
import {Application} from './Application'
import {ShortlistedVenue} from './ShortlistedVenue'

//https://github.com/typeorm/typeorm/issues/1812
//can say what table this entity is based on
@Entity({name: "users"})

export class User {
    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    @Column({type: "varchar", length: 50, unique: true })
    email: string;

    @Column({type: "varchar", length: 50})
    password: string;

    // wait why do we need this nullable?
    @Column({type: "varchar", length: 20}) //made nullable cuz its added after creation
    firstName: string;

    @Column({type: "varchar", length: 20})
    lastName: string;

    @Column({type: "varchar", length: 10})
    phoneNumber: string;

    @Column({type: "varchar"})
    type: "hirer" | "vendor" ;

    // maybe we need these as those update columns?
    @Column({type: "int", default: 0, nullable: true})
    reputation: number;

    // maybe we need these as those update columns?
    @Column({type: "int", default: 0, nullable: true})
    credibility: number;

    // shift into applications or no - double check w teachers
    @Column({type: "varchar", length: 15, nullable: true})
    abn: string;

    @Column({type: "text", nullable: true})
    drivLic: string;

    @Column({type: "text", nullable: true})
    insur: string;

    @Column({type: "text", nullable: true})
    registrationCert: string;

    //dont need to do anything here? already set the createdAt in the table itself
    @CreateDateColumn({type: "datetime"})
    createdAt: Date; 

    //HOW DO WE MAKE THIS OPTIONAL - not all users are vendors
    //for the venue the vendor manages. create one-to-many relation. this doesnt add a column
    @OneToMany(()=> Venue, (venue) => venue.vendor)
    venues: Venue[]

    //for applications. again, how do we make this optional
    @OneToMany(()=> Application , (application) => application.hirer)
    applications: Application []

    //for the shortlisted venues
    @OneToMany(()=>ShortlistedVenue, (shortlistedVenue) => shortlistedVenue.hirer)
    shortlistedVenues: ShortlistedVenue[]
}