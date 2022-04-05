export const makeFileObject = (obj: {}, name: string) => {
  const blob = new Blob(
    [JSON.stringify(obj)],
    { type : 'application/json' }
  );
  return new File([blob as BlobPart], name);
}
