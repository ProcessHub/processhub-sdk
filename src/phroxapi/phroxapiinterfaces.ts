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

export interface ITodo {
  EnableMobileEdit: boolean;
  Id: string;
  ShortSubject: string;
  Subject: string;
}
