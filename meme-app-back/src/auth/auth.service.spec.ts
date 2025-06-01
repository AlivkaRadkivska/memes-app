import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  
  const mockBcryptCompare = bcrypt.compare as jest.Mock;
  const mockBcryptGenSalt = bcrypt.genSalt as jest.Mock;
  const mockBcryptHash = bcrypt.hash as jest.Mock;

  const mockUser: UserEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    role: 'user',
    fullName: 'Test User',
    signature: 'Test signature',
    avatar: null,
    birthday: new Date(),
    followers: [],
    followings: [],
    publications: [],
    comments: [],
    likes: [],
    isBanned: false,
    banReason: null,
    banExpiresAt: null,
    followerCount: 0,
    followingCount: 0,
    publicationCount: 0,
    isFollowing: false,
    getCounts: jest.fn(),
    setIsFollowing: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getOne: jest.fn(),
            createOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const signInDto: SignInCredentialsDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully sign in with correct credentials', async () => {
      const mockToken = 'mock.jwt.token';
      userService.getOne.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signIn(signInDto);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          role: mockUser.role,
        },
        accessToken: mockToken,
      });
      expect(userService.getOne).toHaveBeenCalledWith({ email: signInDto.email });
      expect(mockBcryptCompare).toHaveBeenCalledWith(signInDto.password, mockUser.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userService.getOne.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException(['Користувач не зареєстрований'])
      );
      expect(userService.getOne).toHaveBeenCalledWith({ email: signInDto.email });
    });

    it('should throw UnauthorizedException when user has no password (Google user)', async () => {
      const googleUser = { ...mockUser, password: null };
      userService.getOne.mockResolvedValue(googleUser as UserEntity);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException(['Користувач зареєстрований лише через Google'])
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      userService.getOne.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException(['Неправильний пароль'])
      );
      expect(mockBcryptCompare).toHaveBeenCalledWith(signInDto.password, mockUser.password);
    });
  });

  describe('signUp', () => {
    const signUpDto: SignUpCredentialsDto = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'password123',
      repeatPassword: 'password123',
      fullName: 'New User',
      birthday: new Date(),
    };

    it('should successfully sign up a new user', async () => {
      const hashedPassword = 'hashedPassword123';
      const mockToken = 'mock.jwt.token';
      
      mockBcryptGenSalt.mockResolvedValue('salt');
      mockBcryptHash.mockResolvedValue(hashedPassword);
      userService.createOne.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          role: mockUser.role,
        },
        accessToken: mockToken,
      });
      expect(userService.createOne).toHaveBeenCalledWith(
        {
          ...signUpDto,
          password: hashedPassword,
          role: 'user',
        },
        undefined
      );
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      const invalidDto = { ...signUpDto, repeatPassword: 'differentPassword' };

      await expect(service.signUp(invalidDto)).rejects.toThrow(
        new BadRequestException('Пароль має співпадати')
      );
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      const mockToken = 'mock.jwt.token';
      jwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.generateToken(mockUser.id, mockUser.email, mockUser.role);

      expect(result).toBe(mockToken);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('getHashedPassword', () => {
    it('should hash a password with salt', async () => {
      const password = 'password123';
      const salt = 'mockedSalt';
      const hashedPassword = 'hashedPassword';
      
      mockBcryptGenSalt.mockResolvedValue(salt);
      mockBcryptHash.mockResolvedValue(hashedPassword);

      const result = await service.getHashedPassword(password);

      expect(result).toBe(hashedPassword);
      expect(mockBcryptGenSalt).toHaveBeenCalledWith(9);
      expect(mockBcryptHash).toHaveBeenCalledWith(password, salt);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const partialUser = { id: mockUser.id };
      userService.getOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(partialUser);

      expect(result).toBe(mockUser);
      expect(userService.getOne).toHaveBeenCalledWith({ id: partialUser.id });
    });
  });
});
