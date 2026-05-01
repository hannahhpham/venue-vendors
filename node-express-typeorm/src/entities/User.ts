//all entity files have used lab 8 as a reference
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm'
import {Venue} from './Venue'
import {Application} from './Application'
import {ShortlistedVenue} from './ShortlistedVenue'

//https://github.com/typeorm/typeorm/issues/1812
//can say what table this entity is based on
@Entity({name: "users"})

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phone: string;

    @Column()
    type: "hirer" | "vendor" ;

    @Column({nullable: true})
    reputation?: number;

    @Column({nullable: true})
    credibility?: number;

    @Column({nullable: true})
    abn?: string;

    @Column({nullable: true})
    license?: string;

    @Column({nullable: true})
    insurance?: string;

    @Column({nullable: true})
    registrationCert?: string;

    //dont need to do anything here? already set the createdAt in the table itself
    //do i need the @createdAtColumn here since mssql is alr doing it
    @CreateDateColumn()
    createdAt: Date; 

    //HOW DO WE MAKE THIS OPTIONAL - not all users are vendors
    //for the venue the vendor manages. create one-to-many relation. this doesnt add a column
    @OneToMany(()=> Venue, (venue)=>venue.user)
    venues: Venue[]

    //for applications. again, how do we make this optional
    @OneToMany(()=> Application , (application)=> application.user)
    applications: Application []

    //for the shortlisted venues
    @OneToMany(()=>ShortlistedVenue, (shortlistedVenue)=> shortlistedVenue.user)
    shortlistedVenues: ShortlistedVenue[]
}