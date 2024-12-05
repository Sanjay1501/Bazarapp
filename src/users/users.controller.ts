import { Controller, Get, Post, Body, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSigninDto } from './dto/user-signin';
import { CurrentUser } from 'src/utitlity/decorators/current-user-decorator';
import { AuthenticationGuard } from 'src/utitlity/guards/authentication.guard';
// import { AuthorizeRoles } from 'src/utitlity/decorators/authorize-roles.decorators';
import { AuthorizedGuard } from 'src/utitlity/guards/authorization.guard';
import { Roles } from './entities/user.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  

  @Post("signup")
  async signup(@Body() userSignup: UserSignupDto): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signup(userSignup) };
  }

  @Post("signin")
  async signin(@Body() userSignin: UserSigninDto) {
    const user: UserEntity = await this.usersService.signin(userSignin);
    const accessToken = await this.usersService.accessToken(user);

    return { accessToken, user };
  }

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }
  


  @UseGuards(AuthenticationGuard)
  @Get('me')
  async getProfile(@CurrentUser() currentUser: UserEntity) {
  return currentUser;
}

@Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity | null> {
    console.log("Id is => ",typeof id," ",id)
    const user = await this.usersService.findOne(+id);  
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }



}
