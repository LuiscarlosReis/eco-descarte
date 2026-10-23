import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PontoColeta } from '../../models/ponto-coleta.model';
import { PontoColetaService } from '../../core/services/ponto-coleta.service';

@Component({
  selector: 'app-pontos-coleta',
  templateUrl: './pontos-coleta.component.html',
  styleUrls: ['./pontos-coleta.component.css']
})
export class PontosColetaComponent implements OnInit {
  pontos: PontoColeta[] = [];
  selecionado: PontoColeta | null = null;
  pesquisa = '';
  nome = '';
  endereco = '';
  modo: 'criar' | 'editar' = 'criar';
  carregando = false;
  salvando = false;
  erro = '';
  mensagem = '';

  constructor(
    private service: PontoColetaService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  get filtrados(): PontoColeta[] {
    const termo = this.pesquisa.trim().toLowerCase();

    return this.pontos.filter(p =>
      p.nome.toLowerCase().includes(termo) ||
      (p.endereco ?? '').toLowerCase().includes(termo)
    );
  }

  listar(): void {
    this.carregando = true;
    this.service.listar().subscribe({
      next: dados => {
        this.pontos = dados;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os pontos de coleta.';
        this.carregando = false;
      }
    });
  }

  abrirCadastro(modal: TemplateRef<unknown>): void {
    this.modo = 'criar';
    this.selecionado = null;
    this.nome = '';
    this.endereco = '';
    this.erro = '';
    this.modalService.open(modal, { centered: true, backdrop: 'static' });
  }

  abrirEdicao(modal: TemplateRef<unknown>, ponto: PontoColeta): void {
    this.modo = 'editar';
    this.selecionado = ponto;
    this.nome = ponto.nome;
    this.endereco = ponto.endereco ?? '';
    this.erro = '';
    this.modalService.open(modal, { centered: true, backdrop: 'static' });
  }

  visualizar(modal: TemplateRef<unknown>, ponto: PontoColeta): void {
    this.selecionado = ponto;
    this.modalService.open(modal, { centered: true });
  }

  salvar(modal: NgbModalRef): void {
    const nome = this.nome.trim();

    if (!nome) {
      this.erro = 'Informe o nome do ponto de coleta.';
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados = {
      nome,
      endereco: this.endereco.trim() || null
    };

    const requisicao = this.modo === 'criar'
      ? this.service.criar(dados)
      : this.service.atualizar(this.selecionado!.id, dados);

    requisicao.subscribe({
      next: () => {
        const foiCriacao = this.modo === 'criar';
        this.salvando = false;
        modal.close();
        this.mensagem = foiCriacao
          ? 'Ponto de coleta cadastrado com sucesso!'
          : 'Ponto de coleta atualizado com sucesso!';
        this.listar();
      },
      error: err => {
        this.salvando = false;
        this.erro = err.error?.erro || 'Não foi possível salvar o registro.';
      }
    });
  }

  confirmarExclusao(modal: TemplateRef<unknown>, ponto: PontoColeta): void {
    this.selecionado = ponto;
    this.erro = '';
    this.modalService.open(modal, { centered: true });
  }

  excluir(modal: NgbModalRef): void {
    if (!this.selecionado) return;

    this.service.excluir(this.selecionado.id).subscribe({
      next: () => {
        modal.close();
        this.mensagem = 'Ponto de coleta excluído com sucesso!';
        this.listar();
      },
      error: err => {
        this.erro = err.error?.erro || 'Não foi possível excluir o registro.';
      }
    });
  }
}