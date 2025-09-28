import { createReadStream } from 'fs';
import streamEqual from 'stream-equal';

const areFileContentsEqual = async (filePath1: string, filePath2: string): Promise<boolean> => {
  const stream1 = createReadStream(filePath1);
  const stream2 = createReadStream(filePath2);

  return streamEqual(stream1, stream2);
};

export default areFileContentsEqual;
