import { dataSource } from "../../../dataSource"
import { Folder } from "../../../entities/playground/file-system/Folder"

export class FolderService {
  constructor(private folderTreeRepo = dataSource.getTreeRepository(Folder)) {}

  findFoldersFromUser = async (userId: number) => {
    const allFolders = await this.folderTreeRepo.findTrees({
      relations: ["docs" as keyof Folder, "files" as keyof Folder],
    })

    return allFolders.filter((folder) => folder.userId === userId)
  }
}
