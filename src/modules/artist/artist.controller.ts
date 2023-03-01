import { Body, Controller, HttpCode, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteApiResponse } from '../../common/decorators/requests/deleteApiResponse.decorator';
import { GetApiResponse } from '../../common/decorators/requests/getApiResponse.decorator';
import { PostApiResponse } from '../../common/decorators/requests/postApiResponse.decorator';
import { PutApiResponse } from '../../common/decorators/requests/putApiResponse.decorator';
import { UseCaseProxy } from '../../common/utils/usecase-proxy';
import { ArtistModule } from './artist.module';
import { CreateArtistDTO, UpdateArtistDTO } from './dto/artist.dto';
import { ArtistPresenter } from './dto/artist.presenter';
import { Artist } from './entities/artist.entity';
import {
  CreateArtistUseCase,
  DeleteArtistUseCase,
  FindAllArtistUseCase,
  FindOneArtistUseCase,
  UpdateArtistUseCase,
} from './use-cases';

@ApiTags('Artist')
@Controller('artists')
export class ArtistController {
  constructor(
    @Inject(ArtistModule.GET_ARTISTS_USECASES_PROXY)
    private readonly findAllArtistUseCase: UseCaseProxy<FindAllArtistUseCase>,
    @Inject(ArtistModule.GET_ARTIST_USECASES_PROXY)
    private readonly findOneArtistUseCase: UseCaseProxy<FindOneArtistUseCase>,
    @Inject(ArtistModule.POST_ARTIST_USECASES_PROXY)
    private readonly createArtistUseCase: UseCaseProxy<CreateArtistUseCase>,
    @Inject(ArtistModule.PUT_ARTIST_USECASES_PROXY)
    private readonly updateArtistUseCase: UseCaseProxy<UpdateArtistUseCase>,
    @Inject(ArtistModule.DELETE_ARTIST_USECASES_PROXY)
    private readonly deleteArtistUseCase: UseCaseProxy<DeleteArtistUseCase>,
  ) {}

  @GetApiResponse(ArtistPresenter)
  public async findAllArtist(): Promise<ArtistPresenter[]> {
    const artists = await this.findAllArtistUseCase.getInstance().execute();
    return artists.map((artist) => new ArtistPresenter(artist));
  }

  @GetApiResponse(ArtistPresenter, '/:id')
  public async findOneArtist(
    @Param('id') id: string,
  ): Promise<ArtistPresenter> {
    return await this.findOneArtistUseCase.getInstance().execute(id);
  }

  @PostApiResponse(ArtistPresenter, '', false)
  public async createArtist(
    @Body('artist') artist: CreateArtistDTO,
  ): Promise<ArtistPresenter> {
    return await this.createArtistUseCase.getInstance().execute(artist);
  }

  @PutApiResponse(ArtistPresenter, '/:id')
  public async updateArtist(
    @Param('id') id: string,
    @Body('artist') artist: UpdateArtistDTO,
  ): Promise<ArtistPresenter> {
    return await this.updateArtistUseCase.getInstance().execute(id, artist);
  }

  @HttpCode(204)
  @DeleteApiResponse('/:id')
  public async deleteArtist(@Param('id') id: string): Promise<Artist> {
    return await this.deleteArtistUseCase.getInstance().execute(id);
  }
}
