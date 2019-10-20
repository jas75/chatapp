import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactComponent } from './add-contact.component';
import { SharedModule } from 'src/app/shared.module';

describe('AddContactComponent', () => {
  let component: AddContactComponent;
  let fixture: ComponentFixture<AddContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContactComponent ],
      imports : [
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
