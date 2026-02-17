import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Trip } from './trip.entity';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'point' })
  location: { lat: number; lng: number };

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  contact_person: string;

  @Column({ nullable: true })
  contact_phone: string;

  @Column({ nullable: true })
  contact_email: string;

  @Column({ type: 'simple-array' })
  available_classes: string[];

  @Column({ type: 'jsonb', nullable: true })
  schedule: {
    start_time: string;
    end_time: string;
    days: string[];
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => User, user => user.school)
  users: User[];

  @OneToMany(() => Trip, trip => trip.school)
  trips: Trip[];
}