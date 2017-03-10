/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';

import {WebSocketService} from './web-socket.service';

describe('WebSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebSocketService
      ]
    });
  });

  it('should create the service', inject([WebSocketService], (service: WebSocketService) => {
    expect(service).toBeTruthy();
  }));

  it('should create a websocket', inject([WebSocketService], (service: WebSocketService) => {
    expect(service.connect('ws://someurl.com')).toBeTruthy();
  }));
});
