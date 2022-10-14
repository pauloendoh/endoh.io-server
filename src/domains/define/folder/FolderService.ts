import { getTreeRepository } from "typeorm";
import { Folder } from "../../../entities/playground/file-system/Folder";

export class FolderService {
  constructor(private folderTreeRepo = getTreeRepository(Folder)) {}

  findFoldersFromUser = async (userId: number) => {
    const allFolders = await getTreeRepository(Folder).findTrees({
      relations: ["docs" as keyof Folder, "files" as keyof Folder],
    });

    return allFolders.filter((folder) => folder.userId === userId);
  };
}
