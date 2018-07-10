export interface ISequence {
    index: number;
    arr: string[];
    from?: number;
    to?: number;
    deleteRect1?: boolean;
    deleteRect2?: boolean;
    annotations?: any[];
    doChange?: () => {};
}

export declare type Sequences = ISequence[];
