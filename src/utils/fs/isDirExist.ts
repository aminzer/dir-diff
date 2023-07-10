import { stat } from 'fs/promises';

const isDirExist = async (path: string): Promise<boolean> => {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
};

export default isDirExist;
