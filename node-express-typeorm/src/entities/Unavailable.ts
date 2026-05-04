import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from 'typeorm'
import { User } from './User'
import {Venue} from './Venue'

@Entity({name: "unavailable"})

export class Unavailable {

    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    @Column({type: "time"}) //this will affect our frontend i think fahh
    startTime: string; 

    @Column({type: "time"})
    endTime: string; 

    @Column({type: "date"}) //this too :(
    date: Date;

    @ManyToOne(() => Venue, (venue) => venue.unavailable)
    @JoinColumn({
            name: "venueID", //name in this table
            referencedColumnName: "id", //name in venue table
            foreignKeyConstraintName: "FK_unavailable_venueID", //constraint name in this table
    })
    venue: Venue;


}
