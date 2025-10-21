import { ObjectLiteral, Repository } from 'typeorm';

export async function runRawQueryOnReadReplica<T extends ObjectLiteral>(
  repository: Repository<T>,
  query: string,
  params?: any[],
): Promise<any> {
  const queryRunner = repository.manager.connection.createQueryRunner('slave');

  try {
    const result = await queryRunner.query(query, params);
    return result;
  } finally {
    await queryRunner.release();
  }
}
