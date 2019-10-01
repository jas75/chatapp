import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared.module';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth/auth.service';
import { Identity } from '../interfaces/identity';

describe('AuthGuard should', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      providers: [
        AuthGuard,
        AuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    authGuard = TestBed.get(AuthGuard);
    authService = TestBed.get(AuthService);
  });

  it('create authService', () => {
    expect(authService).toBeTruthy();
  });

  it('be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('be able to hit route when user is logged in', () => {
        const user: Identity = {
          token: 'fake-token',
          user: {
            _id: 'id',
            email: 'email',
            username: 'username',
            password: 'password'
          }
        };
        authService.currentUserSubject.next(user);
        expect(authGuard.canActivate()).toBeTruthy();
    });

  it('not be able to hit route when user is not logged in', () => {
        authService.currentUserSubject.next(null);
        expect(authGuard.canActivate()).toBeFalsy();
  });

});
