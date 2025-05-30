import { Exclude } from 'class-transformer';
import { IsInt } from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { FollowEntity } from 'src/follow/follow.entity';
import { LikeEntity } from 'src/like/like.entity';
import { PublicationEntity } from 'src/publication/publication.entity';
import {
  AfterLoad,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './dto/user-role.dto';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  avatar?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password?: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @Column()
  role: UserRole;

  @Column({ nullable: true })
  birthday?: Date;

  @Column({ nullable: true })
  signature?: string;

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean;

  @Column({ name: 'ban_reason', nullable: true })
  banReason?: string;

  @Column({ name: 'ban_expires_at', nullable: true })
  banExpiresAt?: Date;

  // Relations
  @Exclude({ toPlainOnly: true })
  @OneToMany(() => PublicationEntity, (publication) => publication.author)
  publications: PublicationEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @Exclude({ toPlainOnly: true })
  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followers: FollowEntity[];

  @Exclude({ toPlainOnly: true })
  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  followings: FollowEntity[];

  // Virtual

  @IsInt()
  followerCount: number;

  @IsInt()
  followingCount: number;

  @IsInt()
  publicationCount: number;

  isFollowing: boolean;

  @AfterLoad()
  getCounts(): void {
    this.followerCount = this.followers ? this.followers.length : 0;
    this.followingCount = this.followings ? this.followings.length : 0;

    if (this.publications) {
      const activePublications = this.publications.filter(
        (publication) => publication.status === 'active',
      );
      this.publicationCount = activePublications.length;
    } else {
      this.publicationCount = 0;
    }
  }

  setIsFollowing(user?: Partial<UserEntity>, follows?: FollowEntity[]): void {
    if (!user || !follows) {
      this.isFollowing = false;
      return;
    }

    this.isFollowing = follows.some(
      (follow) => follow.following?.id === this.id,
    );
  }
}
