export type FileType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/gif'
  | 'text/plaint'
  | 'text/html';

export function base64ToFile(
  base64String: string,
  filename: string,
  type: FileType
) {
  const base64Data = base64String.replace(/^data:.+;base64,/, '');
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type, lastModified: Date.now() });
}

export async function linkToBlob(pictureLink: string) {
  const response = await fetch(pictureLink, { mode: 'cors' });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
