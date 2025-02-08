import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { getDataSourceOptions } from 'src/constants/data-source.constant';
import { DataSource } from 'typeorm';
config();

const dataSourceOptions = getDataSourceOptions(new ConfigService());
export const AppDataSource = new DataSource(dataSourceOptions);
