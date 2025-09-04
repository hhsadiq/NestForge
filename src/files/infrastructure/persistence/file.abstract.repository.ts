import { File } from '@src/files/domain/file';
import { NullableType } from '@src/utils/types/nullable.type';

export abstract class FileAbstractRepository {
  abstract create(data: Omit<File, 'id'>): Promise<File>;

  abstract findById(id: File['id']): Promise<NullableType<File>>;
}
