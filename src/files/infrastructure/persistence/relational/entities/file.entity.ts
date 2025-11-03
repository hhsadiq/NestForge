import { Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TABLES } from '@src/common/constants';
import { transformFilePath } from '@src/files/transform-file-path.utils';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({ name: TABLES.file })
export class FileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  @Transform(transformFilePath, { toPlainOnly: true })
  path: string;
}
