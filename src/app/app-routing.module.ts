import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DescartesComponent } from './pages/descartes/descartes.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { PontosColetaComponent } from './pages/pontos-coleta/pontos-coleta.component';
import { ResponsaveisComponent } from './pages/responsaveis/responsaveis.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'descartes', component: DescartesComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'pontos-coleta', component: PontosColetaComponent },
  { path: 'responsaveis', component: ResponsaveisComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}