import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health/health.controller";
import { HealthService } from "./health/health.service";
import { PrismaModule } from "./prisma/prisma.module";
import { HotelsController } from "./hotels/hotels.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
  controllers: [HealthController, HotelsController],
  providers: [HealthService],
})
export class AppModule {}
