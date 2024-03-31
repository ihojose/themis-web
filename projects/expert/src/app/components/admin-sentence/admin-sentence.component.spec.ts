import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSentenceComponent } from './admin-sentence.component';

describe('AdminSentenceComponent', () => {
  let component: AdminSentenceComponent;
  let fixture: ComponentFixture<AdminSentenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSentenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
