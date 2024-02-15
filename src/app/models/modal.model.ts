export interface ModalInputData {
    message: string;
    type: ModalType;
}


export interface ModalOutputData {
    response?: boolean;
}

export type ModalType = 'Acept' | 'Error' | 'Confirm';