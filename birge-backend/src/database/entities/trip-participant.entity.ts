import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Trip } from './trip.entity';

@Entity('trip_participants')
export class TripParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip)
  trip: Trip;

  @Column()
  trip_id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  user_id: string;

  @Column({ type: 'point' })
  pickup_location: { lat: number; lng: number };

  @Column()
  pickup_address: string;

  @Column({ type: 'int', default: 1 })
  pickup_order: number;

  @Column({ type: 'time', nullable: true })
  estimated_pickup_time: string;

  @Column({ type: 'enum', enum: ['active', 'removed', 'completed'], default: 'active' })
  status: string;

  @CreateDateColumn()
  joined_at: Date;
}