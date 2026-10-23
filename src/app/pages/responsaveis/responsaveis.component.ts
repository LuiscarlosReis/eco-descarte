import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Responsavel } from '../../models/responsavel.model';
import { ResponsavelService } from '../../core/services/responsavel.service';

@Component({
  selector: 'app-responsaveis',
  templateUrl: './responsaveis.component.html',
  styleUrls: ['./responsaveis.component.css']
})
export class ResponsaveisComponent implements OnInit {
  responsaveis: Responsavel[] = [];
  selecionado: Responsavel | null = null;

  pesquisa = '';
  nome = '';
  email = '';
  modo: 'criar' | 'editar' = 'criar';

  carregando = false;
  salvando = false;
  erro = '';
  mensagem = '';

  constructor(
    private service: ResponsavelService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  get filtrados(): Responsavel[] {
    const termo = this.pesquisa.trim().toLowerCase();

    return this.responsaveis.filter(r =>
      r.nome.toLowerCase().includes(termo) ||
      (r.email ?? '').toLowerCase().includes(termo)
    );
  }

  listar(): void {
    this.carregando = true;
    this.service.listar().subscribe({
      next: dados => {
        this.responsaveis = dados;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os responsáveis.';
        this.carregando = false;
      }
    });
  }

  abrirCadastro(modal: TemplateRef<unknown>): void {
    this.modo = 'criar';
    this.selecionado = null;
    this.nome = '';
    this.email = '';
    this.erro = '';
    this.modalService.open(modal, { centered: true, backdrop: 'static' });
  }

  abrirEdicao(modal: TemplateRef<unknown>, responsavel: Responsavel): void {
    this.modo = 'editar';
    this.selecionado = responsavel;
    this.nome = responsavel.nome;
    this.email = responsavel.email ?? '';
    this.erro = '';
    this.modalService.open(modal, { centered: true, backdrop: 'static' });
  }

  visualizar(modal: TemplateRef<unknown>, responsavel: Responsavel): void {
    this.selecionado = responsavel;
    this.modalService.open(modal, { centered: true });
  }

  salvar(modal: NgbModalRef): void {
    const nome = this.nome.trim();
    const email = this.email.trim();

    if (!nome) {
      this.erro = 'Informe o nome do responsável.';
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.erro = 'Informe um e-mail válido.';
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados = { nome, email: email || null };

    const requisicao = this.modo === 'criar'
      ? this.service.criar(dados)
      : this.service.atualizar(this.selecionado!.id, dados);

    requisicao.subscribe({
      next: () => {
        const foiCriacao = this.modo === 'criar';
        this.salvando = false;
        modal.close();
        this.mensagem = foiCriacao
          ? 'Responsável cadastrado com sucesso!'
          : 'Responsável atualizado com sucesso!';
        this.listar();
      },
      error: err => {
        this.salvando = false;
        this.erro = err.error?.erro || 'Não foi possível salvar o responsável.';
      }
    });
  }

  confirmarExclusao(modal: TemplateRef<unknown>, responsavel: Responsavel): void {
    this.selecionado = responsavel;
    this.erro = '';
    this.modalService.open(modal, { centered: true });
  }

  excluir(modal: NgbModalRef): void {
    if (!this.selecionado) return;

    this.service.excluir(this.selecionado.id).subscribe({
      next: () => {
        modal.close();
        this.mensagem = 'Responsável excluído com sucesso!';
        this.listar();
      },
      error: err => {
        this.erro = err.error?.erro || 'Não foi possível excluir o responsável.';
      }
    });
  }
}