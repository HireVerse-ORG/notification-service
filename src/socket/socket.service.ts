import { Server, Socket } from "socket.io";
import { ISocketService } from "./interface/socket.service.interface";
import { inject, injectable } from "inversify";
import TYPES from "../core/container/container.types";
import { ISocketManager } from "./interface/socket.manager.interface";

@injectable()
export class SocketService implements ISocketService {
    @inject(TYPES.SocketManager) private socketManager!: ISocketManager;
    private io!: Server;

    initialize(io: Server) {
        if (!this.io) {
            this.io = io;
            this.setupListeners();
        }
    }

    private setupListeners() {
        this.io.on("connection", async (socket: Socket) => {
            const {userId} = socket.handshake.query as {userId: string};
            
            if(userId){
                await this.socketManager.addUser(userId, socket.id);
            }

            socket.on("disconnect", async () => {
                await this.socketManager.removeUser(socket.id);
            });
        });
    }

    emit(event: string, data: any, room?: string): void {
        if (room) {
            this.io.to(room).emit(event, data);
        } else {
            this.io.emit(event, data);
        }
    }

    on(event: string, callback: (socket: Socket, data: any) => void): void {
        this.io.on("connection", (socket: Socket) => {
            socket.on(event, (data) => callback(socket, data));
        });
    }
}
