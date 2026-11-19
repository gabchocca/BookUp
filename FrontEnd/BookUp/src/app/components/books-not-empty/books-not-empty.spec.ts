import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksNotEmpty } from './books-not-empty';

describe('BooksNotEmpty', () => {
  let component: BooksNotEmpty;
  let fixture: ComponentFixture<BooksNotEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksNotEmpty],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksNotEmpty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
