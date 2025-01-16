import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export class ErrorHandlerService{
 constructor(){}
    ErrorNotFound(message: string, microservice: string){
      
        throw new RpcException({message, statusCode:HttpStatus.NOT_FOUND,microservice});
    }
      
    
    ErrorFound(message: string, microservice: string){

        throw new RpcException({message, statusCode:HttpStatus.FOUND, microservice});
  }


  ErrorGone(message:string , microservice:string){
    throw new RpcException({message, statusCode:HttpStatus.GONE, microservice});
  }
}