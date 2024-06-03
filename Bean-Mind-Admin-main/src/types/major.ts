import { TSubject } from "./subject";


export type TMajor = {
  id: number;
  name: string;
  imageUrl: string;
  sort: string;
  subjects: TSubject[];
}

export type TSubjectMajor = {
  subjectId: number;
  majorId: number;
}
