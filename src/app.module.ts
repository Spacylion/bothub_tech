import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configurationValidationSchema } from './config/configuration';
import { RepositoriesModule } from './db/repository/repositories.module';

const logger = new Logger('ConfigModule');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: configurationValidationSchema,
      load: [
        () => {
          const envVars = process.env;
          logger.log(
            `Loaded environment variables for ${process.env.NODE_ENV || 'development'}: ${JSON.stringify(envVars, null, 2)}`,
          );
          return envVars;
        },
      ],
    }),
    RepositoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}