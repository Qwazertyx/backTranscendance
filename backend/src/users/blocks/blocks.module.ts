import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { BlocksController } from './blocks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [BlocksController],
  providers: [BlocksService]
})
export class BlocksModule { }
