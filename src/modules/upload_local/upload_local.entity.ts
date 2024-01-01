import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('upload_locals')
export class UploadLocalEntiy {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public filename: string;

  @Column()
  public path: string;

  @Column()
  public mimetype: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
