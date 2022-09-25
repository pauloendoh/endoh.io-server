import { getTreeRepository } from "typeorm";
import { Folder } from "../../../../entities/playground/file-system/Folder";

const findFoldersFromUser = async (userId: number) => {
  const allFolders = await getTreeRepository(Folder).findTrees({
    relations: ["files" as keyof Folder, "docs" as keyof Folder],
  });

  return allFolders.filter((folder) => folder.userId === userId);
};

export default findFoldersFromUser;
