import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carousel } from './carousel';

describe('Carousel', () => {
  let component: Carousel<any>;
  let fixture: ComponentFixture<Carousel<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carousel],
    }).compileComponents();

    fixture = TestBed.createComponent(Carousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
