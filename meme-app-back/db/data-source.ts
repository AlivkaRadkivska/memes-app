import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
config();

export function getDataSourceOptions(
  configService: ConfigService,
): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: configService.getOrThrow<string>('PGHOST'),
    port: configService.getOrThrow<number>('PGPORT'),
    username: configService.getOrThrow<string>('PGUSER'),
    password: configService.getOrThrow<string>('PGPASSWORD'),
    database: configService.getOrThrow<string>('PGDATABASE'),
    entities: [__dirname + './../src/**/*.entity.{js,ts}'],
    migrations: [__dirname + '/migrations/*-migration.ts'],
    migrationsRun: true,
    synchronize: false,
  };
}

const dataSourceOptions = getDataSourceOptions(new ConfigService());
export const AppDataSource = new DataSource(dataSourceOptions);
