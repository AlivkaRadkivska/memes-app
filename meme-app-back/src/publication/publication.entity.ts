import { IsIn } from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'publication' })
export class PublicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true })
  pictures: string[];

  @Column()
  description: string;

  @Column('text', { array: true })
  keywords: string[];

  @ManyToOne(() => UserEntity, (user) => user.publications, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'last_updated_at', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdatedAt: Date;

  @Column()
  @IsIn(['active', 'hidden', 'draft'])
  status: string;

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean;

  @Column({ name: 'ban_reason', nullable: true })
  banReason?: string;

  @Column({ name: 'ban_expires_at', nullable: true })
  banExpiresAt?: Date;

  // Relations

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    eager: false,
  })
  comments: CommentEntity[];
}
