import { Exclude } from 'class-transformer';
import ArticleEntity from 'src/article/article.entity';
import { UploadLocalEntiy } from 'src/upload_local/upload_local.entity';
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
import { Role } from './role.enum';

@Entity()
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
    default: Role.User
  })
  public roles: Role

  @OneToMany(() => ArticleEntity, (article: ArticleEntity) => article.author)
  public articles: ArticleEntity[];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => UploadLocalEntiy, {
    nullable: true,
  })
  public avatar?: UploadLocalEntiy;

  @Column({ nullable: true })
  public avatarId?: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}

export default UserEntity;
