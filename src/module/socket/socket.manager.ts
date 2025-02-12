import { injectable } from "inversify";
import { ISocketManager } from "./interface/socket.manager.interface";

@injectable()
export class SocketManager implements ISocketManager {
    private userSocketMap: Map<string, string>; 

    constructor() {
        this.userSocketMap = new Map();
    }

    addUser(userId: string, socketId: string) {
        this.userSocketMap.set(userId, socketId);
    }

    removeUser(socketId: string) {
        for (const [userId, id] of this.userSocketMap.entries()) {
            if (id === socketId) {
                this.userSocketMap.delete(userId);
                break;
            }
        }
    }

    getSocketId(userId: string): string | undefined {
        return this.userSocketMap.get(userId);
    }
}
