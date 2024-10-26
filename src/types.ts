export interface Coordinates {
    x: number;
    y: number;
}
    
export interface MapObject {
    type: string;
    coordinates: Coordinates;
}

export interface Polyanet extends MapObject {
    type: "POLYANET";
}

export interface Soloon extends MapObject {
    type: "SOLOON";
    color: string;
}

export interface Cometh extends MapObject {
    type: "COMETH";
    direction: string;
}

export interface MapPayload {
    candidateId: string;
    row: number;
    column: number;
    color?: string;  
    direction?: string;
}

export type AstralObject = Polyanet | Soloon | Cometh;