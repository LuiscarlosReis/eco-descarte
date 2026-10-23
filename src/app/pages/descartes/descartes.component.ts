import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Descarte, DescarteRequest } from '../../models/descarte.model';
import { Categoria } from '../../models/categoria.model';
import { PontoColeta } from '../../models/ponto-coleta.model';
import { Responsavel } from '../../models/responsavel.model';

import { DescarteService } from '../../core/services/descarte.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { PontoColetaService } from '../../core/services/ponto-coleta.service';
import { ResponsavelService } from '../../core/services/responsavel.service';

@Component({
  selector: 'app-descartes',
  templateUrl: './descartes.component.html',
  styleUrls: ['./descartes.component.css']
})
export class DescartesComponent implements OnInit {
  descartes: Descarte[] = [];
  categorias: Categoria[] = [];
  pontos: PontoColeta[] = [];
  responsaveis: Responsavel[] = [];

  selecionado: Descarte | null = null;

  pesquisa = '';
  carregando = false;
  carregandoAuxiliares = false;
  salvando = false;
  excluindo = false;

  erro = '';
  mensagem = '';
  erroAuxiliares = '';

  modo: 'criar' | 'editar' = 'criar';

  form = this.formularioVazio();

  readonly unidades = [
    'unidade',
    'kg',
    'g',
    'litro',
    'ml',
    'tonelada'
  ];

  // São opções sugeridas para o sistema.
  // Ajuste os valores conforme as regras do seu negócio.
  readonly statusCertificado = [
    'Pendente',
    'Em processamento',
    'Certificado emitido'
  ];

  constructor(
    private descarteService: DescarteService,
    private categoriaService: CategoriaService,
    private pontoColetaService: PontoColetaService,
    private responsavelService: ResponsavelService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  private formularioVazio(): DescarteRequest {
    return {
      data_descarte: this.dataHoje(),
      descricao_equipamento: '',
      categoria_id: 0,
      quantidade: 1,
      unidade_medida: 'unidade',
      ponto_coleta_id: 0,
      responsavel_id: 0,
      status_certificado: 'Pendente',
      observacoes: ''
    };
  }

  private dataHoje(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  get descartesFiltrados(): Descarte[] {
    const termo = this.pesquisa.trim().toLowerCase();

    if (!termo) {
      return this.descartes;
    }

    return this.descartes.filter(d =>
      d.descricao_equipamento.toLowerCase().includes(termo) ||
      d.categoria.nome.toLowerCase().includes(termo) ||
      d.ponto_coleta.nome.toLowerCase().includes(termo) ||
      d.responsavel.nome.toLowerCase().includes(termo) ||
      d.status_certificado.toLowerCase().includes(termo)
    );
  }

  carregarDados(): void {
    this.carregarAuxiliares();
    this.listar();
  }

  carregarAuxiliares(): void {
    this.carregandoAuxiliares = true;
    this.erroAuxiliares = '';

    let concluidos = 0;
    let falhou = false;

    const finalizar = (): void => {
      concluidos++;

      if (concluidos === 3) {
        this.carregandoAuxiliares = false;

        if (falhou) {
          this.erroAuxiliares =
            'Não foi possível carregar todos os cadastros auxiliares.';
        }
      }
    };


    this.categoriaService.listar().subscribe({
      next: dados => this.categorias = dados,
      error: () => {
        falhou = true;
        finalizar();
      },
      complete: finalizar
    });

    this.pontoColetaService.listar().subscribe({
      next: dados => this.pontos = dados,
      error: () => {
        falhou = true;
        finalizar();
      },
      complete: finalizar
    });

    this.responsavelService.listar().subscribe({
      next: dados => this.responsaveis = dados,
      error: () => {
        falhou = true;
        finalizar();
      },
      complete: finalizar
    });

  }

  listar(): void {
    this.carregando = true;
    this.erro = '';

    this.descarteService.listar().subscribe({
      next: dados => {
        this.descartes = dados;
        this.carregando = false;
      },
      error: err => {
        this.erro = err.error?.erro ||
          'Não foi possível carregar os descartes.';
        this.carregando = false;
      }
    });
  }

  abrirCadastro(modal: TemplateRef<unknown>): void {
    this.modo = 'criar';
    this.selecionado = null;
    this.form = this.formularioVazio();
    this.erro = '';
    this.mensagem = '';

    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

  abrirEdicao(modal: TemplateRef<unknown>, descarte: Descarte): void {
    this.modo = 'editar';
    this.selecionado = descarte;
    this.erro = '';

    this.form = {
      data_descarte: this.converterDataParaISO(descarte.data_descarte),
      descricao_equipamento: descarte.descricao_equipamento,
      categoria_id: descarte.categoria.id,
      quantidade: descarte.quantidade,
      unidade_medida: descarte.unidade_medida,
      ponto_coleta_id: descarte.ponto_coleta.id,
      responsavel_id: descarte.responsavel.id,
      status_certificado: descarte.status_certificado,
      observacoes: descarte.observacoes ?? ''
    };

    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

  visualizar(modal: TemplateRef<unknown>, descarte: Descarte): void {
    this.selecionado = descarte;
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      scrollable: true
    });
  }

  private converterDataParaISO(data: string): string {
    // A API atual retorna dd/MM/yyyy.
    const partes = data.split('/');

    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    // Também aceita yyyy-MM-dd, caso a API seja padronizada depois.
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }

    return '';
  }

  get dataMaxima(): string {
    return this.dataHoje();
  }

  validarFormulario(): string | null {
    if (!this.form.data_descarte) {
      return 'Informe a data do descarte.';
    }

    if (this.form.data_descarte > this.dataHoje()) {
      return 'A data do descarte não pode ser futura.';
    }

    if (!this.form.descricao_equipamento.trim()) {
      return 'Informe a descrição do equipamento.';
    }

    if (this.form.descricao_equipamento.trim().length > 200) {
      return 'A descrição deve ter no máximo 200 caracteres.';
    }

    if (!this.form.categoria_id ||
      !this.categorias.some(c => c.id === Number(this.form.categoria_id))) {
      return 'Selecione uma categoria válida.';
    }

    if (!Number.isFinite(Number(this.form.quantidade)) ||
      Number(this.form.quantidade) <= 0) {
      return 'A quantidade deve ser maior que zero.';
    }

    if (!this.unidades.includes(this.form.unidade_medida)) {
      return 'Selecione uma unidade de medida válida.';
    }

    if (!this.form.ponto_coleta_id ||
      !this.pontos.some(p => p.id === Number(this.form.ponto_coleta_id))) {
      return 'Selecione um ponto de coleta válido.';
    }

    if (!this.form.responsavel_id ||
      !this.responsaveis.some(r => r.id === Number(this.form.responsavel_id))) {
      return 'Selecione um responsável válido.';
    }

    if (!this.form.status_certificado.trim()) {
      return 'Selecione o status do certificado.';
    }

    return null;
  }

  salvar(modal: NgbModalRef): void {
    const erroValidacao = this.validarFormulario();

    if (erroValidacao) {
      this.erro = erroValidacao;
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados: DescarteRequest = {
      ...this.form,
      data_descarte: this.form.data_descarte,
      descricao_equipamento: this.form.descricao_equipamento.trim(),
      categoria_id: Number(this.form.categoria_id),
      quantidade: Number(this.form.quantidade),
      ponto_coleta_id: Number(this.form.ponto_coleta_id),
      responsavel_id: Number(this.form.responsavel_id),
      status_certificado: this.form.status_certificado.trim(),
      observacoes: this.form.observacoes?.trim() || null
    };

    const foiCriacao = this.modo === 'criar';

    const requisicao = foiCriacao
      ? this.descarteService.criar(dados)
      : this.descarteService.atualizar(this.selecionado!.id, dados);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        modal.close();

        this.mensagem = foiCriacao
          ? 'Descarte cadastrado com sucesso!'
          : 'Descarte atualizado com sucesso!';

        this.listar();
      },
      error: err => {
        this.salvando = false;
        this.erro = err.error?.erro ||
          'Não foi possível salvar o descarte.';
      }
    });
  }

  confirmarExclusao(modal: TemplateRef<unknown>, descarte: Descarte): void {
    this.selecionado = descarte;
    this.erro = '';
    this.excluindo = false;

    this.modalService.open(modal, { centered: true });
  }

  excluir(modal: NgbModalRef): void {
    if (!this.selecionado || this.excluindo) {
      return;
    }

    this.excluindo = true;
    this.erro = '';

    this.descarteService.excluir(this.selecionado.id).subscribe({
      next: () => {
        this.excluindo = false;
        modal.close();
        this.mensagem = 'Descarte excluído com sucesso!';
        this.listar();
      },
      error: err => {
        this.excluindo = false;
        this.erro = err.error?.erro ||
          'Não foi possível excluir o descarte.';
      }
    });
  }
}