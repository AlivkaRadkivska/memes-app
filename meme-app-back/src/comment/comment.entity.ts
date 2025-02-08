import { Transform } from 'class-transformer';
import { PublicationEntity } from 'src/publication/publication.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'comment' })
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ nullable: true })
  picture?: string;

  @Transform(({ value }) => {
    return {
      id: value.id,
      username: value.username,
      email: value.email,
    };
  })
  @ManyToOne(() => UserEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Transform(({ value }) => value.id)
  @ManyToOne(() => PublicationEntity, (publication) => publication.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'publication_id' })
  publication: PublicationEntity;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
