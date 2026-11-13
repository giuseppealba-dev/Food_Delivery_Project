import { Routes } from '@angular/router';
import { TabGestionePage } from './tab-gestione.page';
import { profileRedirectGuard } from '../guards/profile-redirect.guard';

export const routes: Routes = [
    {
        path: '',
        component: TabGestionePage,
        children: [
            {
                path: 'addProduct',
                loadComponent: () =>
                    import('../admin/add-product/add-product.component').then((m) => m.AddProductComponent),
            },
            {
                path: 'listEditProduct',
                loadComponent: () =>
                    import('../admin/list-edit-product/list-edit-product.component').then((m) => m.ListEditProductComponent),
            },
            {
                path: 'addIngredient',
                loadComponent: () =>
                    import('../admin/add-ingredient/add-ingredient.component').then((m) => m.AddIngredientComponent),
            },
            {
                path: 'removeIngredient',
                loadComponent: () =>
                    import('../admin/remove-ingredient/remove-ingredient.component').then((m) => m.RemoveIngredientComponent),
            },
            {
                path: 'removeProduct',
                loadComponent: () =>
                    import('../admin/remove-product/remove-product.component').then((m) => m.RemoveProductComponent),
            },
            {
                path: 'addCategory',
                loadComponent: () =>
                    import('../admin/add-category/add-category.component').then((m) => m.AddCategoryComponent),
            },
            {
                path: 'removeCategory',
                loadComponent: () =>
                    import('../admin/remove-category/remove-category.component').then((m) => m.RemoveCategoryComponent),
            },
            {
                path: '',
                loadComponent: () =>
                    import('../admin/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
            },
            
        ],
    },
];