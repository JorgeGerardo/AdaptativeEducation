export interface Asignature {
    name: string;
    id : string;
}

export interface AsignatureDTO extends Omit<Asignature, 'id'>{}