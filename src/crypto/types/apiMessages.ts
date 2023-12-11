interface BaseAPIMessage {
    status: 'success' | 'error';
};

export interface ErrorAPIMessage extends BaseAPIMessage {
    status: 'error';
    errors: string[];
};

export interface SuccessAPIMessage extends BaseAPIMessage {
    status: 'success';
    meta: any;
    data: any;
};