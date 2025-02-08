import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

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
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + './../../db/migrations/*-migration.ts'],
    migrationsRun: true,
    synchronize: false,
  };
}
