import { AstralObject, Polyanet, Soloon, Cometh, Coordinates } from './types';
import axios from 'axios';

export class MapLoader {
    private static instance: MapLoader;
    private mapObjects: AstralObject[] = [];
  
    private constructor() {}
  
    public static getInstance(): MapLoader {
      if (!MapLoader.instance) {
        MapLoader.instance = new MapLoader();
      }
      return MapLoader.instance;
    }
  
    public async loadMapData(apiUrl: string) {
      const response = await axios.get(apiUrl);
      this.mapObjects = this.parseMapData(response.data.goal);
    }
  
    private parseMapData(mapData: string[][]): AstralObject[] {     
        return mapData.flatMap((row, x) =>
            row.map((cell, y) => this.createObject(cell, { x, y }))
              .filter((obj): obj is AstralObject => obj !== null)
          );
    }

    private createObject(type: string, coordinates: Coordinates): AstralObject | null {          
        if (type === "POLYANET") return { type, coordinates } as Polyanet;
        else if (['RED_SOLOON', 'BLUE_SOLOON', 'WHITE_SOLOON', 'PURPLE_SOLOON'].includes(type)) {
          const color = type.split("_")[0].toLowerCase();
          return { type: "SOLOON", color, coordinates } as Soloon;
        }
        else if (['RIGHT_COMETH', 'LEFT_COMETH', 'UP_COMETH', 'DOWN_COMETH'].includes(type)) {
          const direction = type.split("_")[0].toLowerCase();
          return { type: "COMETH", direction, coordinates } as Cometh;
        }
       else {
            return null; 
        }
    }
  
    public getMapObjects(): AstralObject[] {
      return this.mapObjects;
    }
}