import { TestBed } from '@angular/core/testing';

import { MonitorService } from './monitor.service';

describe('MonitorServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitorService = TestBed.get(MonitorService);
    expect(service).toBeTruthy();
  });
});
