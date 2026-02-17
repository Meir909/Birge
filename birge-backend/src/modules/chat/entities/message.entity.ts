import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { Trip } from '../../../database/entities/trip.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  sender_id: string;

  @ManyToOne(() => Trip, { nullable: true })
  trip: Trip;

  @Column({ nullable: true })
  trip_id: string;

  @Column({ type: 'enum', enum: ['text', 'image', 'location', 'system'], default: 'text' })
  type: 'text' | 'image' | 'location' | 'system';

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    // For location messages
    location?: { lat: number; lng: number; address?: string };
    // For image messages
    image_url?: string;
    image_thumbnail?: string;
    // For system messages
    system_type?: 'trip_started' | 'trip_ended' | 'user_joined' | 'user_left';
  };

  @Column({ default: false })
  is_read: boolean;

  @Column({ nullable: true })
  reply_to_id: string;

  @CreateDateColumn()
  created_at: Date;
}