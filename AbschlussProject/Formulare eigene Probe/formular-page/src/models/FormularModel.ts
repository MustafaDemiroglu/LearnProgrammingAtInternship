// src/models/FormularModel.ts

export interface FormularModel {
    id: number;
    fileName: string;
    txt: string;
    freiTxt: string;
    unitName: string;
    fmtData: string;
    fileDate: string;
    datErst: string;
    userErst: string;
    datAend: string;
    userAend: string;
    datDel?: string | null;
}
