// references:
// FSD Lab 7 and 8
// https://typeorm.io/docs/help/decorator-reference/

import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from 'typeorm'
import { User } from './User'
import {Venue} from './Venue'

//can say what table this entity is based on
@Entity({name: "applications"})

export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    eventName: string;

    @Column({type: "time"}) //this will affect our frontend i think fahh
    startTime: string; 

    @Column({type: "time"})
    endTime: string; 
   
    @Column() //this too :(
    date: Date;

    @Column()
    guests: number;

    @Column()
    description: string;

    @Column({nullable: true})
    abn?: string;

    @Column({nullable: true})
    registrationCert?: string;

    @Column({nullable: true})
    accepted?: boolean;

    @Column({nullable: true})
    notes?: string;

    @Column({nullable: true})
    vendorRating?: number;

    @Column({nullable: true})
    rank?: number;

   
    //IMPORTANT!!! check over this. might need @JoinColumn for both
    //this will add a new column
    //logic: each application is owned by 1 user. 
    //       each application references 1 venue
    
    //get the hirerID
    @ManyToOne(() => User, (user) => user.applications)
    @JoinColumn({
            name: "hirerID", //name in apps table
            referencedColumnName: "id", //name in users table
            foreignKeyConstraintName: "FK_applications_hirerID", //constraint name in apps table
    })
    user: User;

    //get the venueID
    @ManyToOne(() => Venue, (venue) => venue.applications)
    @JoinColumn({
            name: "venueID", //name in apps table
            referencedColumnName: "id", //name in venue table
            foreignKeyConstraintName: "FK_applications_venueID", //constraint name in apps table
    })
    venue: Venue;

   
}