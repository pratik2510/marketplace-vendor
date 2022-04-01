import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductV2Component } from './add-product-v2.component';

describe('AddProductV2Component', () => {
  let component: AddProductV2Component;
  let fixture: ComponentFixture<AddProductV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
