import { Component, OnInit } from '@angular/core';
import { DescarteService } from '../../core/services/descarte.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { PontoColetaService } from '../../core/services/ponto-coleta.service';

import { Descarte } from '../../models/descarte.model';
import { Categoria } from '../../models/categoria.model';
import { PontoColeta } from '../../models/ponto-coleta.model';

interface IndicadorGrafico {
  nome: string;
  quantidade: number;
  percentual: number;
}

interface IndicadorStatus extends IndicadorGrafico {
  cor: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  descartes: Descarte[] = [];
  categorias: Categoria[] = [];
  pontos: PontoColeta[] = [];

  totalDescartes = 0;
  totalPontos = 0;
  totalQuantidade = 0;

  descartesPorCategoria: IndicadorGrafico[] = [];
  descartesPorPonto: IndicadorGrafico[] = [];
  certificados: IndicadorStatus[] = [];

  carregando = true;
  erro = '';

  constructor(
    private descarteService: DescarteService,
    private categoriaService: CategoriaService,
    private pontoColetaService: PontoColetaService
  ) {}

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.carregando = true;
    this.erro = '';

    let respostas = 0;
    let houveErro = false;

    const finalizar = (): void => {
      respostas++;

      if (respostas === 3) {
        this.carregando = false;

        if (houveErro) {
          this.erro = 'Não foi possível carregar todos os dados do dashboard.';
        }

        this.calcularIndicadores();
      }
    };

    this.descarteService.listar().subscribe({
      next: dados => {
        this.descartes = dados;
      },
      error: () => {
        houveErro = true;
        finalizar();
      },
      complete: finalizar
    });

    this.categoriaService.listar().subscribe({
      next: dados => {
        this.categorias = dados;
      },
      error: () => {
        houveErro = true;
        finalizar();
      },
      complete: finalizar
    });

    this.pontoColetaService.listar().subscribe({
      next: dados => {
        this.pontos = dados;
      },
      error: () => {
        houveErro = true;
        finalizar();
      },
      complete: finalizar
    });
  }

  private calcularIndicadores(): void {
    this.totalDescartes = this.descartes.length;
    this.totalPontos = this.pontos.length;

    this.totalQuantidade = this.descartes.reduce(
      (total, descarte) => total + (Number(descarte.quantidade) || 0),
      0
    );

    this.calcularCategorias();
    this.calcularPontos();
    this.calcularCertificados();
  }

  private calcularCategorias(): void {
    const contagem = this.categorias.map(categoria => {
      const quantidade = this.descartes.filter(
        descarte => descarte.categoria?.id === categoria.id
      ).length;

      return {
        nome: categoria.nome,
        quantidade
      };
    });

    const maiorValor = Math.max(
      1,
      ...contagem.map(item => item.quantidade)
    );

    this.descartesPorCategoria = contagem
      .map(item => ({
        ...item,
        percentual: (item.quantidade / maiorValor) * 100
      }))
      .sort((a, b) => b.quantidade - a.quantidade);
  }

  private calcularPontos(): void {
    const contagem = this.pontos.map(ponto => {
      const quantidade = this.descartes.filter(
        descarte => descarte.ponto_coleta?.id === ponto.id
      ).length;

      return {
        nome: ponto.nome,
        quantidade
      };
    });

    const maiorValor = Math.max(
      1,
      ...contagem.map(item => item.quantidade)
    );

    this.descartesPorPonto = contagem
      .map(item => ({
        ...item,
        percentual: (item.quantidade / maiorValor) * 100
      }))
      .sort((a, b) => b.quantidade - a.quantidade);
  }

  private calcularCertificados(): void {
    const situacoes = [
      { nome: 'Pendente', cor: 'warning' },
      { nome: 'Em processamento', cor: 'info' },
      { nome: 'Certificado emitido', cor: 'success' }
    ];

    const contagem = situacoes.map(situacao => {
      const quantidade = this.descartes.filter(
        descarte =>
          this.normalizarStatus(descarte.status_certificado) ===
          this.normalizarStatus(situacao.nome)
      ).length;

      return {
        ...situacao,
        quantidade
      };
    });

    const maiorValor = Math.max(
      1,
      ...contagem.map(item => item.quantidade)
    );

    this.certificados = contagem.map(item => ({
      ...item,
      percentual: this.totalDescartes > 0 ? (item.quantidade / this.totalDescartes) * 100 : 0
    }));
  }

  private normalizarStatus(valor: string | null | undefined): string {
    return (valor ?? '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  get totalCertificadosEmitidos(): number {
    return this.certificados.find(
      item => this.normalizarStatus(item.nome) ===
        this.normalizarStatus('Certificado emitido')
    )?.quantidade ?? 0;
  }

  get totalCertificadosPendentes(): number {
    return this.certificados
      .filter(item =>
        this.normalizarStatus(item.nome) === this.normalizarStatus('Pendente') ||
        this.normalizarStatus(item.nome) === this.normalizarStatus('Em processamento')
      )
      .reduce((total, item) => total + item.quantidade, 0);
  }

  get percentualCertificadosEmitidos(): number {
    if (this.totalDescartes === 0) {
      return 0;
    }

    return Math.round(
      (this.totalCertificadosEmitidos / this.totalDescartes) * 100
    );
  }
}