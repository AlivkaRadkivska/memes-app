import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentFiltersDto } from './dto/comment-filters.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

const mockFileUploadService = {
  uploadFiles: jest.fn(),
  deleteFiles: jest.fn(),
};

describe('CommentService', () => {
  let service: CommentService;
  let repository: jest.Mocked<Repository<CommentEntity>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<CommentEntity>>;

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

  const mockComment: CommentEntity = {
    id: '456e7890-e89b-12d3-a456-426614174001',
    text: 'Test comment content',
    picture: null,
    user: mockUser,
    publication: {
      id: '789e1234-e89b-12d3-a456-426614174002',
      pictures: ['https://example.com/pic.jpg'],
      description: 'Test description',
      keywords: ['test'],
      author: mockUser,
      comments: [],
      likes: [],
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      isFollowing: false,
      getCounts: jest.fn(),
      setIsLiked: jest.fn(),
      setIsFollowing: jest.fn(),
    } as any,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: FileUploadService,
          useValue: mockFileUploadService,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repository = module.get(getRepositoryToken(CommentEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return paginated comments without filters', async () => {
      const mockComments = [mockComment];
      const totalCount = 1;
      queryBuilder.getManyAndCount.mockResolvedValue([
        mockComments,
        totalCount,
      ]);

      const result = await service.getAll();

      expect(result).toEqual({
        items: mockComments,
        totalItems: totalCount,
        limit: 10,
        page: 1,
        totalPages: 1,
      });
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('comment');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'comment.user',
        'user',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'comment.publication',
        'publication',
      );
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
    });

    it('should filter comments by publication ID', async () => {
      const filters: CommentFiltersDto = { publicationId: 'pub-123' };
      const mockComments = [mockComment];
      queryBuilder.getManyAndCount.mockResolvedValue([mockComments, 1]);

      await service.getAll(filters);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'publication.id = :publicationId',
        {
          publicationId: filters.publicationId,
        },
      );
    });

    it('should filter comments by user ID', async () => {
      const filters: CommentFiltersDto = { userId: 'user-123' };
      const mockComments = [mockComment];
      queryBuilder.getManyAndCount.mockResolvedValue([mockComments, 1]);

      await service.getAll(filters);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.id = :userId', {
        userId: filters.userId,
      });
    });

    it('should handle custom pagination parameters', async () => {
      const filters: CommentFiltersDto = { limit: 5, page: 3 };
      const mockComments = [mockComment];
      queryBuilder.getManyAndCount.mockResolvedValue([mockComments, 25]);

      const result = await service.getAll(filters);

      expect(queryBuilder.take).toHaveBeenCalledWith(5);
      expect(queryBuilder.skip).toHaveBeenCalledWith(10); // (page - 1) * limit = (3 - 1) * 5
      expect(result.totalPages).toBe(5); // Math.ceil(25 / 5)
      expect(result.limit).toBe(5);
      expect(result.page).toBe(3);
    });
  });

  describe('getOne', () => {
    it('should return a comment when found', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';
      repository.findOne.mockResolvedValue(mockComment);

      const result = await service.getOne(commentId, userId);

      expect(result).toBe(mockComment);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: [
          { id: commentId, user: { id: userId } },
          { id: commentId, publication: { author: { id: userId } } },
        ],
      });
    });

    it('should throw NotFoundException when comment not found', async () => {
      const commentId = 'nonexistent-comment';
      const userId = 'user-123';
      repository.findOne.mockResolvedValue(null);

      await expect(service.getOne(commentId, userId)).rejects.toThrow(
        new NotFoundException(['Comment not found']),
      );
    });
  });

  describe('createOne', () => {
    const createCommentDto: CreateCommentDto = {
      text: 'New comment content',
      publication: mockComment.publication,
      picture: undefined,
    };

    it('should create a comment without picture', async () => {
      const newComment = { ...mockComment, text: createCommentDto.text };
      repository.create.mockReturnValue(newComment);
      repository.save.mockResolvedValue(newComment);

      const result = await service.createOne(createCommentDto, mockUser);

      expect(result).toBe(newComment);
      expect(repository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        user: mockUser,
      });
      expect(repository.save).toHaveBeenCalledWith(newComment);
    });

    it('should create a comment with picture', async () => {
      const mockFile = {
        fieldname: 'picture',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const pictureUrl = 'https://example.com/picture.jpg';
      const newComment = {
        ...mockComment,
        text: createCommentDto.text,
        picture: pictureUrl,
      };

      mockFileUploadService.uploadFiles.mockResolvedValue([pictureUrl]);
      repository.create.mockReturnValue(newComment);
      repository.save.mockResolvedValue(newComment);

      const result = await service.createOne(
        createCommentDto,
        mockUser,
        mockFile,
      );

      expect(mockFileUploadService.uploadFiles).toHaveBeenCalledWith([
        mockFile,
      ]);
      expect(newComment.picture).toBe(pictureUrl);
      expect(repository.save).toHaveBeenCalledWith(newComment);
      expect(result).toBe(newComment);
    });
  });

  describe('deleteOne', () => {
    it('should delete a comment without picture successfully', async () => {
      const commentId = 'comment-123';
      const commentWithoutPicture = { ...mockComment, picture: null };

      jest.spyOn(service, 'getOne').mockResolvedValue(commentWithoutPicture);
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.deleteOne(commentId, mockUser);

      expect(service.getOne).toHaveBeenCalledWith(commentId, mockUser.id);
      expect(repository.delete).toHaveBeenCalledWith({
        id: commentWithoutPicture.id,
      });
      expect(mockFileUploadService.deleteFiles).not.toHaveBeenCalled();
    });

    it('should delete a comment with picture successfully', async () => {
      const commentId = 'comment-123';
      const pictureUrl = 'https://example.com/picture.jpg';
      const commentWithPicture = { ...mockComment, picture: pictureUrl };

      jest.spyOn(service, 'getOne').mockResolvedValue(commentWithPicture);
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });
      mockFileUploadService.deleteFiles = jest
        .fn()
        .mockResolvedValue(undefined);

      await service.deleteOne(commentId, mockUser);

      expect(service.getOne).toHaveBeenCalledWith(commentId, mockUser.id);
      expect(mockFileUploadService.deleteFiles).toHaveBeenCalledWith([
        pictureUrl,
      ]);
      expect(repository.delete).toHaveBeenCalledWith({
        id: commentWithPicture.id,
      });
    });

    it('should handle case when comment is not found', async () => {
      const commentId = 'nonexistent-comment';
      jest
        .spyOn(service, 'getOne')
        .mockRejectedValue(new NotFoundException(['Comment not found']));

      await expect(service.deleteOne(commentId, mockUser)).rejects.toThrow(
        new NotFoundException(['Comment not found']),
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
