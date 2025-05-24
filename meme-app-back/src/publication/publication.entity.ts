import { Exclude, Transform } from 'class-transformer';
import { IsIn, IsInt } from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { FollowEntity } from 'src/follow/follow.entity';
import { LikeEntity } from 'src/like/like.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  AfterLoad,
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

  @Transform(({ value }) => {
    return {
      id: value.id,
      avatar: value.avatar,
      username: value.username,
      fullName: value.fullName,
      email: value.email,
    };
  })
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

  @Exclude()
  @OneToMany(() => CommentEntity, (comment) => comment.publication)
  comments: CommentEntity[];

  @Exclude()
  @OneToMany(() => LikeEntity, (like) => like.publication)
  likes: LikeEntity[];

  // Virtual

  @IsInt()
  likeCount: number;

  @IsInt()
  commentCount: number;

  isLiked: boolean;
  isFollowing: boolean;

  @AfterLoad()
  getCounts(): void {
    this.commentCount = this.comments ? this.comments.length : 0;
    this.likeCount = this.likes ? this.likes.length : 0;
  }

  setIsLiked(user?: Partial<UserEntity>): void {
    if (!user) {
      this.isLiked = false;
      return;
    }

    this.isLiked = this.likes.some((like) => like.user?.id === user.id);
  }

  setIsFollowing(user?: Partial<UserEntity>, follows?: FollowEntity[]): void {
    if (!user || !follows) {
      this.isFollowing = false;
      return;
    }

    this.isFollowing = follows.some(
      (follow) =>
        follow.follower?.id === user.id &&
        follow.following?.id === this.author.id,
    );
  }
}
