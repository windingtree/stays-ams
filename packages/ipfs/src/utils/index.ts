import { Blob } from '@web-std/blob';
import { File } from '@web-std/file';

export const obj2File = (obj: unknown, fileName: string): File => {
  const blob = new Blob([JSON.stringify(obj)], { type : 'application/json' });
  return new File([blob as BlobPart], fileName);
}
