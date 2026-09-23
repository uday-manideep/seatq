import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("hotels")
export class HotelsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    return this.prisma.hotel.findMany({
      include: { branches: true },
    });
  }
}
