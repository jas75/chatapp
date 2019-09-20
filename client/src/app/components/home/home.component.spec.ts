import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be an invalid register form', () => {
    component.registerForm.controls['email'].setValue('');
    component.registerForm.controls['alias'].setValue('');
    component.registerForm.controls['password'].setValue('');
    component.registerForm.controls['confPassword'].setValue('');
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should be an invalid login form', () => {
    component.switchForm();
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should create HomeComponent', () => {
    expect(component).toBeTruthy();
  });
});
