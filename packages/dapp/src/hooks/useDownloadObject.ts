export type UseDownloadObjectHook = (
  object: {},
  fileName: string
) => void;

export const useDownloadObject = (): UseDownloadObjectHook =>
  (object, fileName) => {
    const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(object, null, 2))}`;
    const downloadElem = document.createElement('a');
    downloadElem.setAttribute('href', data);
    downloadElem.setAttribute('download', fileName);
    downloadElem.click();
  }
