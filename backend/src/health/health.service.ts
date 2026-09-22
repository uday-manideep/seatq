import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "pg";
import Redis from "ioredis";

export interface HealthStatus {
  status: "ok" | "degraded";
  database: "connected" | "error";
  redis: "connected" | "error";
}

@Injectable()
export class HealthService implements OnModuleDestroy {
  private redis: Redis;

  constructor(private config: ConfigService) {
    this.redis = new Redis(this.config.get<string>("REDIS_URL")!, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
  }

  async check(): Promise<HealthStatus> {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    return {
      status: database === "connected" && redis === "connected" ? "ok" : "degraded",
      database,
      redis,
    };
  }

  private async checkDatabase(): Promise<"connected" | "error"> {
    const client = new Client({
      connectionString: this.config.get<string>("DATABASE_URL"),
    });
    try {
      await client.connect();
      await client.query("SELECT 1");
      return "connected";
    } catch {
      return "error";
    } finally {
      await client.end().catch(() => undefined);
    }
  }

  private async checkRedis(): Promise<"connected" | "error"> {
    try {
      if (this.redis.status !== "ready") {
        await this.redis.connect();
      }
      await this.redis.ping();
      return "connected";
    } catch {
      return "error";
    }
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }
}
