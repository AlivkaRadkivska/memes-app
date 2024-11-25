import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export function getDataSourceOptions(
  configService: ConfigService,
): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: configService.get('PGHOST'),
    port: configService.get('PGPORT'),
    username: configService.get('PGUSER'),
    password: configService.get('PGPASSWORD'),
    database: configService.get('PGDATABASE'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
  };
}

const dataSourceOptions = getDataSourceOptions(new ConfigService());
export const AppDataSource = new DataSource(dataSourceOptions);
