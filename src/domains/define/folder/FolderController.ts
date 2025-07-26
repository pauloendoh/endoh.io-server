import {
  Body,
  CurrentUser,
  Delete,
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
} from "routing-controllers"
import { dataSource } from "../../../dataSource"
import { User } from "../../../entities/User"
import { Folder } from "../../../entities/playground/file-system/Folder"
import findFoldersFromUser from "../../../utils/domain/playground/file-system/findFoldersFromUser"
import { FolderService } from "./FolderService"

@JsonController()
export class FolderController {
  constructor(
    private folderRepo = dataSource.getRepository(Folder),
    private folderTreeRepo = dataSource.getTreeRepository(Folder)
  ) {}

  @Post("/playground/folders")
  async createFolder(
    @CurrentUser({ required: true })
    user: User,
    @Body({ required: true }) sent: Folder
  ) {
    sent.userId = user.id

    // it looks like parentFolderId doesn't work on saving
    if (sent.parentFolderId) {
      const parentFolder = await this.folderRepo.findOne({
        where: { id: sent.parentFolderId },
      })
      if (parentFolder) {
        sent.parentFolder = parentFolder
      }
    }

    const folderRepo = dataSource.getTreeRepository(Folder)
    await folderRepo.save(sent)

    const userFolders = await findFoldersFromUser(user.id)

    return userFolders
  }

  @Put("/playground/folders")
  async updateFolder(
    @CurrentUser({ required: true })
    user: User,
    @Body({ required: true }) sent: Folder
  ) {
    const found = await this.folderTreeRepo.findOne({
      where: {
        userId: user.id,
        id: sent.id,
      },
    })

    if (!found) throw new NotFoundError("Not found.")

    sent.userId = user.id
    if (sent.parentFolderId) {
      const parentFolder = await this.folderRepo.findOne({
        where: { id: sent.parentFolderId },
      })
      if (parentFolder) {
        sent.parentFolder = parentFolder
      }
    }

    await this.folderTreeRepo.save(sent)

    const userFolders = await findFoldersFromUser(user.id)

    return userFolders
  }

  @Get("/playground/folders")
  async getFolders(
    @CurrentUser({ required: true })
    user: User
  ) {
    const service = new FolderService()
    const userFolders = await service.findFoldersFromUser(user.id)
    return userFolders
  }

  @Delete("/playground/folders")
  async deleteFolder(
    @CurrentUser({ required: true })
    user: User,
    @Body() sent: Folder
  ) {
    const { affected } = await this.folderTreeRepo.delete({
      userId: user.id,
      id: sent.id,
    })
    if (affected === 0) throw new NotFoundError("Not found.")

    const userFolders = await findFoldersFromUser(user.id)
    return userFolders
  }

  @Delete("/playground/folders/:id")
  async deleteFolderId(
    @CurrentUser({ required: true })
    user: User,
    @Param("id") folderId: number
  ) {
    const { affected } = await this.folderTreeRepo
      .delete({
        userId: user.id,
        id: folderId,
      })
      .catch((err) => {
        throw new InternalServerError(err.message)
      })
    if (affected === 0) throw new NotFoundError("Not found.")

    const userFolders = await findFoldersFromUser(user.id)
    return userFolders
  }
}
