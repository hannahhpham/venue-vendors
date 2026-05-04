import { Entity, PrimaryColumn, JoinColumn, Column, CreateDateColumn, ManyToOne} from 'typeorm'
import { User } from './User'
import {Venue} from './Venue'

@Entity({name: "shortlistedVenues"})

export class ShortlistedVenue {

    //2 primary keys
    @PrimaryColumn({type: "int"}) 
    hirerID: number;
    
    @PrimaryColumn({type: "int"}) 
    venueID: number;

    @Column({type: "int"})
    rank: number;

    //REALLY NEED TO CHECK OVER THESE
    //this gets the shortlistedVenue's hirer 
    @ManyToOne(() => User, (user) => user.shortlistedVenues)
    @JoinColumn({
            name: "hirerID", //name in this table
            referencedColumnName: "id", //name in referenced table
            foreignKeyConstraintName: "FK_shortlistedVenues_hirerID", //constraint name in thus table
    })
    user: User;

    //this gets the shortlisted venue's venue
    @ManyToOne(() => Venue, (venue) => venue.shortlistedVenues)
    @JoinColumn({
            name: "venueID", //name in this table
            referencedColumnName: "id", //name in venue table
            foreignKeyConstraintName: "FK_shortlistedVenues_venueID", //constraint name in this table
    })
    venue: Venue;





}