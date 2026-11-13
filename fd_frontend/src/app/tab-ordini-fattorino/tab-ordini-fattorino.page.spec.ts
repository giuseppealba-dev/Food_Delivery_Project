import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabOrdiniFattorinoPage } from './tab-ordini-fattorino.page';

describe('TabOrdiniFattorinoPage', () => {
  let component: TabOrdiniFattorinoPage;
  let fixture: ComponentFixture<TabOrdiniFattorinoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabOrdiniFattorinoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
