import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDecisitionTreeComponent } from './admin-decisition-tree.component';

describe('AdminDecisitionTreeComponent', () => {
  let component: AdminDecisitionTreeComponent;
  let fixture: ComponentFixture<AdminDecisitionTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDecisitionTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDecisitionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
