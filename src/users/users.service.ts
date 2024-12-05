import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSigninDto } from './dto/user-signin';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(body: UserSignupDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(body.email);
    if (userExists) {
      throw new BadRequestException('Email is not available');
    }
    body.password = await hash(body.password, 10);
    const user = this.usersRepository.create(body);
    const savedUser = await this.usersRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async signin(userSigninDto: UserSigninDto): Promise<UserEntity | null> {
    // Fetch the user by email and include the password in the result
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')  
      .where('users.email = :email', { email: userSigninDto.email })  // Use :email parameter for matching email
      .getOne();

    if (!userExists) {
      throw new BadRequestException('Invalid credentials');
    }

    // Compare passwords
    const passwordMatch = await compare(userSigninDto.password, userExists.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    // Remove password from the user object before returning
    delete userExists.password;

    return userExists;
  }

  // Method to generate an access token for a user
  async accessToken(user: UserEntity): Promise<string> {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY, // Secret key for signing the token
      { expiresIn: process.env.ACCESS_TOKEN_EXP_TIME } 
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const users= await this.usersRepository.find();
    if(!users){
      
        throw new NotFoundException('No user found ');
    }
    return users
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<UserEntity | null> {
    const user= this.usersRepository.findOne({ where: { id } });

    if(!user){
      throw new NotFoundException('No user found ');
    }

    return user
  }
}
