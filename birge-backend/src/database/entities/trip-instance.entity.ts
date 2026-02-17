import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Trip } from './trip.entity';

@Entity('trip_instances')
export class TripInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip)
  trip: Trip;

  @Column()
  trip_id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'scheduled' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  actual_start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  actual_end_time: Date;

  @Column({ type: 'jsonb', nullable: true })
  live_tracking: {
    current_location: { lat: number; lng: number };
    current_speed: number;
    heading: number;
    last_update: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  completed_waypoints: string[];

  @Column({ type: 'float', nullable: true })
  actual_distance: number;

  @Column({ type: 'int', nullable: true })
  actual_duration: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}