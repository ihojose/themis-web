import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLawsComponent } from './admin-laws.component';

describe('AdminLawsComponent', () => {
  let component: AdminLawsComponent;
  let fixture: ComponentFixture<AdminLawsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLawsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
