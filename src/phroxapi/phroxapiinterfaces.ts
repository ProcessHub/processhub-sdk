export interface IRoxFile {
  name: string;
  fileId: number;
  iconLink: string;
}

export interface IRoxFolder {
  name: string;
  folderId: number;
}

export interface IEscalation {
  EnableMobileEdit: boolean;
  Id: string;
  ParentFileID: number;
  ShortSubject: string;
  Title: string;
}