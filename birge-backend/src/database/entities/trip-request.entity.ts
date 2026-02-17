import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Trip } from './trip.entity';

@Entity('trip_requests')
export class TripRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip)
  trip: Trip;

  @Column()
  trip_id: string;

  @ManyToOne(() => User)
  requester: User;

  @Column()
  requester_id: string;

  @Column({ type: 'point' })
  pickup_location: { lat: number; lng: number };

  @Column()
  pickup_address: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
  status: string;

  @Column({ nullable: true })
  rejection_reason: string;

  @Column({ type: 'jsonb', nullable: true })
  ai_analysis: {
    compatibility_score: number;
    route_impact: {
      additional_distance: number;
      additional_time: number;
      deviation_percentage: number;
    };
    recommendation: 'accept' | 'consider' | 'reject';
    reasons: string[];
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}