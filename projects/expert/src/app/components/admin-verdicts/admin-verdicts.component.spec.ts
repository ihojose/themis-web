import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVerdictsComponent } from './admin-verdicts.component';

describe('AdminVerdictsComponent', () => {
  let component: AdminVerdictsComponent;
  let fixture: ComponentFixture<AdminVerdictsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVerdictsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminVerdictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
