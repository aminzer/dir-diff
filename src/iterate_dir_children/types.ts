import { FsEntry } from '../models';

type OnEachChildOptions = {
  skipEntryIteration?: () => void,
};

export type OnEachChild = (fsEntry: FsEntry, options?: OnEachChildOptions) => void | Promise<void>;
