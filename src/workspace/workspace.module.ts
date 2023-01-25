import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [PrismaModule]
})
export class WorkspaceModule {}
