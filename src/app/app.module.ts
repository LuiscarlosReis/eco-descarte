import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DescartesComponent } from './pages/descartes/descartes.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { PontosColetaComponent } from './pages/pontos-coleta/pontos-coleta.component';
import { ResponsaveisComponent } from './pages/responsaveis/responsaveis.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DescartesComponent,
    CategoriasComponent,
    PontosColetaComponent,
    ResponsaveisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}