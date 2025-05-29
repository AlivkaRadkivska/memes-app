import { Transform } from 'class-transformer';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique(['follower', 'following'])
@Entity({ name: 'follow' })
export class FollowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Transform(({ value }) => {
    return {
      id: value.id,
      username: value.username,
      email: value.email,
      avatar: value.avatar,
      fullName: value.fullName,
    };
  })
  @ManyToOne(() => UserEntity, (user) => user.followings, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_id' })
  follower: UserEntity;

  @Transform(({ value }) => {
    return {
      id: value.id,
      username: value.username,
      email: value.email,
      avatar: value.avatar,
      fullName: value.fullName,
    };
  })
  @ManyToOne(() => UserEntity, (user) => user.followers, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'following_id' })
  following: UserEntity;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  startFollowAt: Date;
}
