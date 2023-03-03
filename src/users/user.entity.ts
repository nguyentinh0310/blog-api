import { Exclude } from 'class-transformer';
import ArticleEntity from 'src/article/article.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

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

  @OneToMany(() => ArticleEntity, (article: ArticleEntity) => article.author)
  public articles: ArticleEntity[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}

export default UserEntity;
