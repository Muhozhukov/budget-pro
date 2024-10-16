import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { name, email, password } = createUserDto;

    if (!name || !email || !password) {
      throw new BadRequestException('Bad request!');
    }

    const userByEmail = await this.usersRepository.findOne({
      where: { email },
    });

    if (userByEmail) {
      throw new ConflictException('This email already exist');
    }

    const newUser = await this.usersRepository.create(createUserDto);

    await this.usersRepository.save(newUser);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }

  async findByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('No email');
    }

    return this.usersRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<string | User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Not found!');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { name, password, email } = updateUserDto;
    const userToUpdate = await this.usersRepository.findOneBy({ id });

    if (!userToUpdate) {
      throw new NotFoundException('Not found!');
    }

    userToUpdate.name = name ? name : userToUpdate.name;
    userToUpdate.email = email ? email : userToUpdate.email;
    userToUpdate.password = password ? password : userToUpdate.password;

    this.usersRepository.update(id, userToUpdate);
    return userToUpdate;
  }

  async remove(id: number) {
    const userToRemove = await this.usersRepository.findOneBy({ id });

    if (!userToRemove) {
      throw new NotFoundException('Not found!');
    }

    this.usersRepository.remove([userToRemove]);

    return userToRemove;
  }
}
