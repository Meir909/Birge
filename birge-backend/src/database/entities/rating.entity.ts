import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { TripParticipant } from './trip-participant.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  reviewer: User;

  @Column()
  reviewer_id: string;

  @ManyToOne(() => User)
  reviewee: User;

  @Column()
  reviewee_id: string;

  @ManyToOne(() => TripParticipant, { nullable: true })
  trip_participant: TripParticipant;

  @Column({ nullable: true })
  trip_participant_id: string;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @CreateDateColumn()
  created_at: Date;
}