import { Injectable, BadRequestException, NotFoundException, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './interfaces/category.interface';
import { Model } from 'mongoose'
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-categoty.dto';
import { PlayersService } from '../players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
    private readonly playerService: PlayersService
  ) { }

  async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<Category> {


    const { category } = createCategoryDTO;

    const foundCategory = await this.categoryModel.findOne({ category }).exec()

    if (foundCategory) throw new BadRequestException(`Category ${category} already registered.`)

    const categoryCreated = new this.categoryModel(createCategoryDTO)

    return await categoryCreated.save()

  }

  async consultAllCategories(): Promise<Array<Category>> {
    return await this.categoryModel.find().populate("players").exec();
  }

  async consultCategoryById(category: string): Promise<Category> {

    const foundCategory = await this.categoryModel.findOne({ category }).populate("players").exec();

    if (!foundCategory) throw new NotFoundException(`Category ${category} not found`)

    return foundCategory
  }

  async consultCategoryOfPlayer(idPlayer: any): Promise<Category> {
    const players = await this.playerService.consultAllPlayers()

    const playerFilter = players.filter(player => player._id == idPlayer)

    if (playerFilter.length == 0) {
      throw new BadRequestException(`The id ${idPlayer} is not a player!`)
    }

    return await this.categoryModel.findOne().where('players').in(idPlayer).exec()


  }

  async updateCategory(category: string, updateCategoryDTO: UpdateCategoryDTO): Promise<void> {

    const existCategory = await this.categoryModel.findOne({ category }).lean().exec()

    if (!existCategory) throw new NotFoundException(`Category ${category} not found`)

    await this.categoryModel.findOneAndUpdate({ category }, { $set: updateCategoryDTO }).exec()
  }

  async AddPlayerCategory(params: Array<String>): Promise<void> {

    const category = params['category']
    const idPlayer = params['idPlayer']

    const foundCategory = await this.categoryModel.findOne({ category }).exec()
    const playerAlreadyRegisteredCategory = await this.categoryModel.find({ category }).where('players').in(idPlayer).exec()

    await this.playerService.consultPlayerById(idPlayer)

    if (!foundCategory) throw new BadRequestException(`Category ${category} not registered!`)

    if (playerAlreadyRegisteredCategory.length > 0) throw new BadRequestException(`Player with id ${idPlayer} already registered on category.`)

    foundCategory.players.push(idPlayer)

    await (await this.categoryModel.findOneAndUpdate({ category }, { $set: foundCategory })).execPopulate()
  }



}
