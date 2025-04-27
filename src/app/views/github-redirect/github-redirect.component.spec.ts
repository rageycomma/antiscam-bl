import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubRedirectComponent } from './github-redirect.component';

describe('GithubRedirectComponent', () => {
  let component: GithubRedirectComponent;
  let fixture: ComponentFixture<GithubRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GithubRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GithubRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
