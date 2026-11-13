import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { 
  fastFoodOutline, 
  leafOutline, 
  appsOutline, 
  addCircleOutline, 
  createOutline, 
  trashOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
  standalone: true
})
export class AdminDashboardComponent  implements OnInit {

  constructor(private router: Router) {
    addIcons({ 
      fastFoodOutline, 
      leafOutline, 
      appsOutline, 
      addCircleOutline, 
      createOutline, 
      trashOutline 
    });
  }

  ngOnInit() {}

  navigateToAddProduct() {
    this.router.navigate(['/user/gestione_locale/addProduct']);
  }

  navigateToListEditProduct() {
    this.router.navigate(['/user/gestione_locale/listEditProduct']);
  }

  navigateToAddIngredient() {
    this.router.navigate(['/user/gestione_locale/addIngredient']);
  }

  navigateToRemoveIngredient() {
    this.router.navigate(['/user/gestione_locale/removeIngredient']);
  }

  navigateToRemoveProduct() {
    this.router.navigate(['/user/gestione_locale/removeProduct']);
  }

  navigateToAddCategory() {
    this.router.navigate(['/user/gestione_locale/addCategory']);
  }

  navigateToRemoveCategory() {
    this.router.navigate(['/user/gestione_locale/removeCategory']);
  }
}
