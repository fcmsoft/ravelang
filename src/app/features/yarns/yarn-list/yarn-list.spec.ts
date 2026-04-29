import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnList } from './yarn-list';

describe('YarnList', () => {
  let component: YarnList;
  let fixture: ComponentFixture<YarnList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YarnList],
    }).compileComponents();

    fixture = TestBed.createComponent(YarnList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
