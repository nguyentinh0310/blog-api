import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import ArticleEntity from '../article/article.entity';
import { UploadLocalEntiy } from '../upload_local/upload_local.entity';
import { Role } from 'src/enums';

@Entity('users')
class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  public roles: Role;

  @OneToMany(() => ArticleEntity, (article: ArticleEntity) => article.author)
  public articles: ArticleEntity[];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => UploadLocalEntiy, {
    nullable: true,
  })
  public avatar?: UploadLocalEntiy;

  @Column({ nullable: true })
  public avatarId?: string;

  @Column({ nullable: true })
  public refresh_token: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}

export default UserEntity;
