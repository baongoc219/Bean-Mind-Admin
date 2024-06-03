import { TSubject } from "./subject";
import { TUser } from "./user";

export type TCertificate = {
    id: number;
    imageUrl: string;
    status: number;
    name: string;
    subjectId: number;
    mentor: TUser;
    sort?: any;
    subject: TSubject;
}
export type TUpdateCertificate = {
    id: number;
    status: number;
}
