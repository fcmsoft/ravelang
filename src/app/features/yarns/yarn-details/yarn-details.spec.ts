import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnDetails } from './yarn-details';

describe('YarnDetails', () => {
  let component: YarnDetails;
  let fixture: ComponentFixture<YarnDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YarnDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(YarnDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
