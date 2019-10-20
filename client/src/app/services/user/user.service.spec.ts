import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { SharedModule } from 'src/app/shared.module';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports : [
      SharedModule
    ]
  }));

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
