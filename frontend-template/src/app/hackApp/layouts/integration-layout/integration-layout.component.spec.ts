import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationLayoutComponent } from './integration-layout.component';

describe('IntegrationLayoutComponent', () => {
  let component: IntegrationLayoutComponent;
  let fixture: ComponentFixture<IntegrationLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrationLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
