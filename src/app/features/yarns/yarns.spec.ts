import { TestBed } from '@angular/core/testing';

import { Yarns } from './yarns';

describe('Yarns', () => {
    let service: Yarns;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(Yarns);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
