// references:
// FSD Lab 7 and 8
// https://typeorm.io/docs/help/decorator-reference/

import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from 'typeorm'
import { User } from './User'
import { Venue } from './Venue'


// adapt for SQLite Testing
const isTesting = process.env.NODE_ENV === "test";


//can say what table this entity is based on
@Entity({name: "applications"})


export class Application {
    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    @Column({type: "varchar", length: 50})
    eventName: string;

    @Column({type: "time"}) //this will affect our frontend i think fahh
    startTime: string; 

    @Column({type: "time"})
    endTime: string; 
   
    @Column({type: "date"}) //this too :(
    date: Date;

    @Column({type: "int"})
    guests: number;

    @Column({type: "text"})
    description: string;

    @Column({type: "varchar", length: 20, nullable: true})
    abn?: string;

    @Column({type: "text", nullable: true})
    registrationCert?: string;

    @Column({
        type: isTesting ? "boolean" : "bit",
        nullable: true
    })
    isAccepted?: boolean;

    @Column({type: "text", nullable: true})
    notes?: string;

    @Column({type: "int", nullable: true})
    vendorRating?: number;

    @Column({type: "int"})
    rank: number;

    @Column({type: "int"})
    hirerID: number;

    @Column({type: "int"})
    venueID: number;

   
    //IMPORTANT!!! check over this.
    //this will add a new column
    //logic: each application is owned by 1 user. 
    //       each application references 1 venue
    
    //get the hirerID
    @ManyToOne(() => User, (user) => user.applications, {
        nullable: false
    })
    @JoinColumn({
            name: "hirerID", //name in apps table
            referencedColumnName: "id", //name in users table
            foreignKeyConstraintName: "FK_applications_hirerID", //constraint name in apps table
    })
    hirer: User;

    //get the venueID
    @ManyToOne(() => Venue, (venue) => venue.applications, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
            name: "venueID", //name in apps table
            referencedColumnName: "id", //name in venue table
            foreignKeyConstraintName: "FK_applications_venueID", //constraint name in apps table
    })
    venue: Venue;

   
}