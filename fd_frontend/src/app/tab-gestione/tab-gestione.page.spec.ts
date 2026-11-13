import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabGestionePage } from './tab-gestione.page';

describe('TabGestionePage', () => {
  let component: TabGestionePage;
  let fixture: ComponentFixture<TabGestionePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabGestionePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
