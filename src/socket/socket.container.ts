import { Container } from "inversify";
import { SocketService } from "./socket.service";
import { ISocketService } from "./interface/socket.service.interface";
import TYPES from "../core/container/container.types";
import { socketServer } from ".";
import { SocketManager } from "./socket.manager";
import { ISocketManager } from "./interface/socket.manager.interface";

 
export function loadSocketContainer(container: Container){
    container.bind<ISocketManager>(TYPES.SocketManager).to(SocketManager).inSingletonScope();    
    container.bind<ISocketService>(TYPES.SocketService).to(SocketService).inSingletonScope();    
    const socketService = container.get<SocketService>(TYPES.SocketService);
    socketService.initialize(socketServer);
}