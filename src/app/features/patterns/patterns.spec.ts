import { TestBed } from '@angular/core/testing';

import { Patterns } from './patterns';

describe('Patterns', () => {
    let service: Patterns;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(Patterns);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
