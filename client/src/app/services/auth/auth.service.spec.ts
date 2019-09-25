import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { SharedModule } from 'src/app/shared.module';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ]
    });
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
