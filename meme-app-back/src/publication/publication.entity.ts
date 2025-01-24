import { IsIn, IsInt } from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { LikeEntity } from 'src/like/like.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
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

  @OneToMany(() => CommentEntity, (comment) => comment.publication, {
    eager: false,
  })
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.publication, {
    eager: false,
  })
  likes: LikeEntity[];

  // Virtual

  @IsInt()
  likesCount: number;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  getLikesCount(): void {
    this.likesCount = this.likes ? this.likes.length : 0;
    return;
  }

  isLiked: boolean;

  @AfterLoad()
  setIsLiked(user?: UserEntity) {
    if (!user) {
      this.isLiked = false;
      return;
    }

    this.isLiked = this.likes.some((like) => like.user.id === user.id);
  }
}
