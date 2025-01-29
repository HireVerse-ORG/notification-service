export interface ISocketManager {
    addUser(userId: string, socketId: string): Promise<void> | void;
    removeUser(socketId: string): Promise<void> | void;
    getSocketId(userId: string): Promise<string | undefined> | string | undefined;
}
