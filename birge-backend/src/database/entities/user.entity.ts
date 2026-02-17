import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { School } from './school.entity';
import { Trip } from './trip.entity';
import { TripParticipant } from './trip-participant.entity';
import { Rating } from './rating.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ type: 'point', nullable: true })
  home_location: { lat: number; lng: number };

  @Column()
  address: string;

  @Column({ nullable: true })
  district: string;

  @ManyToOne(() => School)
  school: School;

  @Column()
  school_id: string;

  @Column()
  child_class: string;

  @Column({ type: 'enum', enum: ['driver', 'passenger', 'both'], default: 'passenger' })
  role: string;

  @Column({ nullable: true })
  car_brand: string;

  @Column({ nullable: true })
  car_model: string;

  @Column({ nullable: true })
  car_color: string;

  @Column({ nullable: true })
  car_plate: string;

  @Column({ type: 'int', nullable: true })
  available_seats: number;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  total_ratings: number;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'simple-array', default: [] })
  badges: string[];

  @Column({ default: true })
  is_verified: boolean;

  @Column({ default: false })
  is_blocked: boolean;

  @Column({ nullable: true })
  blocked_reason: string;

  @Column({ type: 'timestamp', nullable: true })
  blocked_until: Date;

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    ai_enabled: boolean;
    ai_frequency: 'frequent' | 'moderate' | 'rare';
    ai_style: 'formal' | 'friendly' | 'brief';
    notification_settings: object;
  };

  @Column({ type: 'simple-array', default: [] })
  emergency_contacts: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // Relations
  @OneToMany(() => Trip, trip => trip.driver)
  trips_as_driver: Trip[];

  @OneToMany(() => TripParticipant, participant => participant.user)
  trips_as_passenger: TripParticipant[];

  @OneToMany(() => Rating, rating => rating.reviewer)
  ratings_given: Rating[];

  @OneToMany(() => Rating, rating => rating.reviewee)
  ratings_received: Rating[];
}