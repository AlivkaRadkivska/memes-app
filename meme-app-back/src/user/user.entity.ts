import { PublicationEntity } from 'src/publication/publication.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @Column()
  role: string;

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

  @OneToMany(() => PublicationEntity, (publication) => publication.author, {
    eager: false,
  })
  publications: PublicationEntity[];
}
