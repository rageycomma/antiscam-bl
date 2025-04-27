import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToBlocklistComponent } from './add-to-blocklist.component';

describe('AddToBlocklistComponent', () => {
  let component: AddToBlocklistComponent;
  let fixture: ComponentFixture<AddToBlocklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToBlocklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToBlocklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
