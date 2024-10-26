import axios from 'axios';
import { MapPayload, AstralObject } from './types';
import dotenv from 'dotenv';
dotenv.config();

export class MegaverseAPI {

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async sendRequestWithRetry(         // Function to send requests with retry on rate-limit (status code 429)
        method: 'POST' | 'DELETE',
        endpoint: string,
        payload: MapPayload
    ): Promise<void> {
        while (true) {
            try {
                if (method === 'POST') {
                    await axios.post(endpoint, payload);
                } else if (method === 'DELETE') {
                    await axios.delete(endpoint, { data: payload });
                }
                return;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 429) {
                    const waitTime = 1000;
                    await this.delay(waitTime);
                } else {
                    throw error;
                }
            }
        }
    }

    public async modifyMapWithGoal(            // Function to modify map based on action (create/delete)
        candidateId: string,
        objectType: string,
        action: 'create' | 'delete',
        mapObjects: AstralObject[]
    ): Promise<void> {
        const filteredObjects = mapObjects.filter((obj) => {
            if (objectType === 'polyanets' && obj.type === 'POLYANET') return true;
            if (objectType === 'soloons' && obj.type === 'SOLOON') return true;
            if (objectType === 'comeths' && obj.type === 'COMETH') return true;
            return false;
        });

        for (const obj of filteredObjects) {
            const endpoint = `${process.env.MEGAVERSE_ACTION_API}${objectType}`;
            const payload: MapPayload = {
                candidateId,
                row: obj.coordinates.x,
                column: obj.coordinates.y,
                ...(action === 'create' && obj.type === 'SOLOON' && { color: obj.color }),
                ...(action === 'create' && obj.type === 'COMETH' && { direction: obj.direction }),
            };

            try {
                await this.sendRequestWithRetry(action === 'create' ? 'POST' : 'DELETE', endpoint, payload);
                console.log(`Successfully ${action}ed ${obj.type} at (${obj.coordinates.x}, ${obj.coordinates.y})`);
            } catch (error) {
                const errorMessage = (error as Error).message;
                throw new Error(`Failed to ${action} ${obj.type} at (${obj.coordinates.x}, ${obj.coordinates.y}): ${errorMessage}`);
            }
        }
    }
}