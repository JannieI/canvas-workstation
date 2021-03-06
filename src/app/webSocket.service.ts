/*
 * Service for web sockets
 */

// TODO - is this still used?

// Web socket import { Injectable } from '@angular/core';

// @Injectable()
// export class NameService {

//     constructor() { }
// }
import { Injectable }                 from '@angular/core';
import * as io                        from 'socket.io-client';
import { Observable }                 from 'rxjs';
import * as Rx                        from 'rxjs';

// Our Functions
import { GlobalVariableService }      from './global-variable.service';

@Injectable()
export class WebsocketService {

    canvasWebSocketServerUrl: string = this.globalVariableService.canvasServerURI ;

    // Our socket connection
    private socket;

    constructor(
        private globalVariableService: GlobalVariableService,

    ) { }

    connect(): Rx.Subject<MessageEvent> {
        // If you aren't familiar with environment variables then
        // you can hard code `environment.ws_url` as `http://localhost:5000`
        this.socket = io(this.canvasWebSocketServerUrl);

        // We define our observable which will observe any incoming messages
        // from our socket.io server.
        let observable = new Observable(observer => {
            this.socket.on('message', (data) => {
            console.log("Received message from Websocket Server")
            observer.next(data);
            })
            return () => {
            this.socket.disconnect();
            }
        });
        
        // We define our Observer which will listen to messages
        // from our other components and send messages back to our
        // socket server whenever the `next()` method is called.
        let observer = {
            next: (data: Object) => {
                this.socket.emit('message', JSON.stringify(data));
            },
        };

        // we return our Rx.Subject which is a combination
        // of both an observer and observable.
        return Rx.Subject.create(observer, observable);
    }

}