import { dataSource } from "../../../../dataSource"
import { Folder } from "../../../../entities/playground/file-system/Folder"

const findFoldersFromUser = async (userId: number) => {
  const allFolders = await dataSource.getTreeRepository(Folder).findTrees({
    relations: ["files" as keyof Folder, "docs" as keyof Folder],
  })

  return allFolders.filter((folder) => folder.userId === userId)
}

export default findFoldersFromUser
