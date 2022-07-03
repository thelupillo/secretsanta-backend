import { PrismaClient } from '@prisma/client';

class DB {
  private static prisma: PrismaClient;

  private static createInstance() {
    this.prisma = new PrismaClient();
  }

  static getInstance() {
    if (!this.prisma) this.createInstance();
    return this.prisma;
  }
}

export default DB;
