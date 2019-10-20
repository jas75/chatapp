import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { SharedModule } from 'src/app/shared.module';

describe('ContactService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      SharedModule
    ]
  }));

  it('should be created', () => {
    const service: ContactService = TestBed.get(ContactService);
    expect(service).toBeTruthy();
  });
});
