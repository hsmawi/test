/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {CardContentComponent} from './card-content.component';

describe('CardContentComponent', () => {
  let component: CardContentComponent;
  let fixture: ComponentFixture<CardContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
