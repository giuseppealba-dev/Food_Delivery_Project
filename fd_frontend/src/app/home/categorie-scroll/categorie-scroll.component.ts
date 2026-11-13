import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonChip } from '@ionic/angular/standalone';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { ProductService } from 'src/app/services/product-service/product.service';
import { SharedDataService } from 'src/app/services/shared/shared-data.service';


@Component({
  selector: 'app-categorie-scroll',
  templateUrl: './categorie-scroll.component.html',
  styleUrls: ['./categorie-scroll.component.scss'],
  imports: [IonChip, CommonModule],
  standalone: true
})
export class CategorieScrollComponent implements OnInit {

  items: { id: number, name: string }[] = [];
  
  // Riferimento per il contenitore dello scroll orizzontale (CHATGPT)
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  constructor(
    private categoryService: CategoryService, 
    public sharedData: SharedDataService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categoryService.getCategories().subscribe(
      (response) => {
        if (response.success) {
          this.items = response.data.map((category: any) => ({ 
            id: category.ID_categoria, 
            name: category.nome_categoria 
          }));
        } else {
          console.error('Failed to load categories:', response);
        }
        // Aggiungi "Offerte" come prima categoria
        this.items.unshift({ id: 0, name: "Offerte" });
      }
    );
  }

  onCategoryClick(categoryId: number) {
    if (this.sharedData.getSelectedCategory() === categoryId) {
      this.sharedData.setSelectedCategory(null);
      console.log('Categoria deselezionata:', categoryId);
    } else {
      this.sharedData.setSelectedCategory(categoryId);
      console.log('Categoria selezionata:', categoryId);
    }
  }

  // Gestione dello scroll orizzontale con la rotellina del mouse (CHATGPT)
  onWheel(event: WheelEvent) {
    // Previene il comportamento di scroll predefinito della pagina
    event.preventDefault();
    
    // Converte lo scroll verticale in scroll orizzontale
    const scrollAmount = event.deltaY;
    const scrollContainer = this.scrollContainer.nativeElement;
    
    // Applica lo scroll orizzontale
    scrollContainer.scrollLeft += scrollAmount;
  }

}
