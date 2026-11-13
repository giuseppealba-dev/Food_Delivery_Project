import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabOrdiniAdminPage } from './tab-ordini-admin.page';

describe('TabOrdiniAdminPage', () => {
  let component: TabOrdiniAdminPage;
  let fixture: ComponentFixture<TabOrdiniAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabOrdiniAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
