import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserEntity from '../users/user.entity';
import CategoryEntity from '../categories/category.entity';

@Entity('articles')
class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public slug: string;

  @Column()
  public title: string;

  @Column({ default: '' })
  public shortDescription: string;

  @Column({ default: '' })
  public fullDescription: string;

  @Column()
  public thumbnailUrl?: string;

  @Column('simple-array')
  public tagList: string[];

  @Column({ default: '' })
  public mdContent?: string;

  @Column({ default: '' })
  public htmlContent?: string;

  @ManyToOne(() => UserEntity, (author: UserEntity) => author.articles)
  public author: UserEntity;

  @ManyToMany(
    () => CategoryEntity,
    (category: CategoryEntity) => category.articles,
    { cascade: true }, //cascade bản ghi liên quan
  )
  public categories: CategoryEntity[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}

export default ArticleEntity;
