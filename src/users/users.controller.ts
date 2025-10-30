import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CheckAbility } from '@src/access-management/casl/check-ability.decorator';
import { PoliciesGuard } from '@src/access-management/casl/policies.guard';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@src/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@src/utils/infinity-pagination';
import { NullableType } from '@src/utils/types/nullable.type';
import { UserSummary } from '@src/views/domain/user-summary';

import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({ action: 'read', subject: 'User' })
  @ApiOkResponse({
    type: User,
  })
  @Get('summary')
  @HttpCode(HttpStatus.OK)
  getUsersSummary(): Promise<NullableType<UserSummary[]>> {
    return this.usersService.getUsersSummary();
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({ action: 'read', subject: 'User' })
  @ApiOkResponse({
    type: User,
  })
  @Get('summary/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  getUserSummary(
    @Param('id') id: User['id'],
  ): Promise<NullableType<UserSummary>> {
    return this.usersService.getUserSummary(id);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({ action: 'create', subject: 'User' })
  @ApiCreatedResponse({
    type: User,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createProfileDto);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({ action: 'read', subject: 'User' })
  @ApiOkResponse({
    type: InfinityPaginationResponse(User),
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.usersService.findManyWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({ action: 'read', subject: 'User' })
  @ApiOkResponse({
    type: User,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({ action: 'update', subject: 'User' })
  @ApiOkResponse({
    type: User,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: User['id'],
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.usersService.update(id, updateProfileDto);
  }
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({ action: 'delete', subject: 'User' })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: User['id']): Promise<void> {
    return this.usersService.remove(id);
  }
}
