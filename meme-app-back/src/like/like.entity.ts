import { Transform } from 'class-transformer';
import { PublicationEntity } from 'src/publication/publication.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique(['user', 'publication'])
@Entity({ name: 'like' })
export class LikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Transform(({ value }) => value.id)
  @ManyToOne(() => UserEntity, (user) => user.likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Transform(({ value }) => value.id)
  @ManyToOne(() => PublicationEntity, (publication) => publication.likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'publication_id' })
  publication: PublicationEntity;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
