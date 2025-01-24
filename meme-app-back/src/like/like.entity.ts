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

  @ManyToOne(() => UserEntity, (user) => user.likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PublicationEntity, (publication) => publication.likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'publication_id' })
  publication: PublicationEntity;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
