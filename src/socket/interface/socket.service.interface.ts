import { Socket } from "socket.io";

export interface ISocketService {
    emit(event: string, data: any, room?: string): void;
    on(event: string, callback: (socket: Socket, data: any) => void): void;
}
