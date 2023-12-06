import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalAddItemcardapioComponent } from './modal-add-itemcardapio.component';

describe('ModalAddItemcardapioComponent', () => {
  let component: ModalAddItemcardapioComponent;
  let fixture: ComponentFixture<ModalAddItemcardapioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddItemcardapioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAddItemcardapioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
