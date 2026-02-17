import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { School } from './school.entity';
import { TripParticipant } from './trip-participant.entity';
import { TripRequest } from './trip-request.entity';
import { TripInstance } from './trip-instance.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  driver: User;

  @Column()
  driver_id: string;

  @ManyToOne(() => School)
  school: School;

  @Column()
  school_id: string;

  @Column()
  class: string;

  @Column({ type: 'enum', enum: ['to_school', 'from_school', 'both'] })
  trip_type: string;

  @Column({ type: 'simple-array' })
  days_of_week: string[];

  @Column({ type: 'time' })
  departure_time: string;

  @Column({ type: 'time', nullable: true })
  return_time: string;

  @Column({ type: 'int' })
  available_seats: number;

  @Column({ type: 'int', default: 0 })
  occupied_seats: number;

  @Column({ type: 'jsonb' })
  route: {
    start_location: { lat: number; lng: number; address: string };
    end_location: { lat: number; lng: number; address: string };
    waypoints: Array<{
      location: { lat: number; lng: number; address: string };
      order: number;
      participant_id?: string;
      estimated_arrival?: string;
    }>;
    total_distance: number;
    total_duration: number;
    polyline: string;
  };

  @Column({ default: true })
  is_recurring: boolean;

  @Column({ type: 'enum', enum: ['active', 'full', 'completed', 'cancelled'], default: 'active' })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    auto_accept: boolean;
    same_class_only: boolean;
    price_per_trip?: number;
  };

  @Column({ type: 'float', nullable: true })
  ai_efficiency_score: number;

  @Column({ type: 'jsonb', nullable: true })
  ai_metrics: {
    route_optimality: number;
    time_efficiency: number;
    participant_compatibility: number;
    last_calculated: Date;
  };

  @Column({ default: false })
  is_ai_optimized: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => TripParticipant, participant => participant.trip)
  participants: TripParticipant[];

  @OneToMany(() => TripRequest, request => request.trip)
  requests: TripRequest[];

  @OneToMany(() => TripInstance, instance => instance.trip)
  instances: TripInstance[];
}