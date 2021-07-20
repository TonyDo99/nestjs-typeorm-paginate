import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getConnectionToken } from '@nestjs/typeorm';
import { Connection, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { paginate } from './../paginate';
import { Pagination } from '../pagination';
import { TestEntity } from './test.entity';
import { PaginationTypeEnum } from '../interfaces';

describe('Paginate with queryBuilder', () => {
  let app: TestingModule;
  let connection: Connection;
  let runner: QueryRunner;
  let queryBuilder: SelectQueryBuilder<TestEntity>;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          entities: [TestEntity],
          host: 'localhost',
          port: 3306,
          type: 'mysql',
          username: 'root',
          password: '',
          database: 'test',
        }),
      ],
    }).compile();
    connection = app.get(getConnectionToken());
    runner = connection.createQueryRunner();
    await runner.startTransaction();

    queryBuilder = runner.manager.createQueryBuilder(TestEntity, 't');
  });

  afterEach(() => {
    runner.rollbackTransaction();
    app.close();
  });

  it('Can call paginate', async () => {
    const result = await paginate(queryBuilder, { limit: 10, page: 1 });
    expect(result).toBeInstanceOf(Pagination);
  });

  it('Can use paginationType take', async () => {
    const result = await paginate(queryBuilder, { limit: 10, page: 1, paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET });
    expect(result).toBeInstanceOf(Pagination);
  });
});
