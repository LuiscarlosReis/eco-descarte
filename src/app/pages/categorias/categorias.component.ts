import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriaSelecionada: Categoria | null = null;

  pesquisa = '';
  carregando = false;
  salvando = false;
  erro = '';
  mensagem = '';
  nome = '';
  modo: 'criar' | 'editar' = 'criar';

  constructor(
    private categoriaService: CategoriaService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  get categoriasFiltradas(): Categoria[] {
    const termo = this.pesquisa.trim().toLowerCase();

    return this.categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(termo)
    );
  }

  listar(): void {
    this.carregando = true;
    this.erro = '';

    this.categoriaService.listar().subscribe({
      next: dados => {
        this.categorias = dados;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as categorias.';
        this.carregando = false;
      }
    });
  }

  abrirCadastro(modal: TemplateRef<unknown>): void {
    this.modo = 'criar';
    this.categoriaSelecionada = null;
    this.nome = '';
    this.erro = '';
    this.mensagem = '';

    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static'
    });
  }

  abrirEdicao(modal: TemplateRef<unknown>, categoria: Categoria): void {
    this.modo = 'editar';
    this.categoriaSelecionada = categoria;
    this.nome = categoria.nome;
    this.erro = '';
    this.mensagem = '';

    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static'
    });
  }

  visualizar(modal: TemplateRef<unknown>, categoria: Categoria): void {
    this.categoriaSelecionada = categoria;
    this.modalService.open(modal, { centered: true });
  }

  salvar(modal: NgbModalRef): void {
    const nome = this.nome.trim();

    if (!nome) {
      this.erro = 'Informe o nome da categoria.';
      return;
    }

    this.salvando = true;
    this.erro = '';

    const requisicao = this.modo === 'criar'
      ? this.categoriaService.criar({ nome })
      : this.categoriaService.atualizar(
          this.categoriaSelecionada!.id,
          { nome }
        );

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        modal.close();
        this.mensagem = this.modo === 'criar'
          ? 'Categoria cadastrada com sucesso!'
          : 'Categoria atualizada com sucesso!';
        this.listar();
      },
      error: err => {
        this.salvando = false;
        this.erro = err.error?.erro
          || 'Não foi possível salvar a categoria.';
      }
    });
  }

  confirmarExclusao(modal: TemplateRef<unknown>, categoria: Categoria): void {
    this.categoriaSelecionada = categoria;
    this.erro = '';
    this.modalService.open(modal, { centered: true });
  }

  excluir(modal: NgbModalRef): void {
    if (!this.categoriaSelecionada) {
      return;
    }

    this.categoriaService
      .excluir(this.categoriaSelecionada.id)
      .subscribe({
        next: () => {
          modal.close();
          this.mensagem = 'Categoria excluída com sucesso!';
          this.listar();
        },
        error: err => {
          this.erro = err.error?.erro
            || 'Não foi possível excluir a categoria.';
        }
      });
  }
}