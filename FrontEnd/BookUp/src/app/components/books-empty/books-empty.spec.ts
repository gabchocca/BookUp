import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksEmpty } from './books-empty';

describe('BooksEmpty', () => {
  let component: BooksEmpty;
  let fixture: ComponentFixture<BooksEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksEmpty],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksEmpty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
