import CategoryEntity from 'src/categories/category.entity';
import UserEntity from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
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
