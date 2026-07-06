import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { RetiradaService } from '../../services/retirada.service';
import { ProducaoService } from '../../services/producao.service';
import { RelatorioDiario, ProducaoDiaria } from '../../models/retirada.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly retiradaService = inject(RetiradaService);
  private readonly producaoService = inject(ProducaoService);
  private readonly cdr = inject(ChangeDetectorRef);

  totalClientes = 0;
  totalReceberam = 0;
  totalNaoReceberam = 0;
  totalRetiradas = 0;
  totalMoradoresRua = 0;
  relatorioDiario: RelatorioDiario | null = null;
  loading = true;

  producao: ProducaoDiaria | null = null;
  quantidadeInput: number | null = null;
  savingProducao = false;
  producaoMensagem = '';
  producaoErro = '';

  ngOnInit(): void {
    this.loadStats();
    this.loadProducao();
  }

  loadProducao(): void {
    this.producaoService.getProducaoDoDia().subscribe({
      next: (producao) => {
        this.producao = producao;
        this.quantidadeInput = producao.quantidade_produzida || null;
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  salvarProducao(): void {
    this.producaoMensagem = '';
    this.producaoErro = '';

    if (this.quantidadeInput == null || this.quantidadeInput < 0) {
      this.producaoErro = 'Informe uma quantidade válida (número igual ou maior que zero).';
      return;
    }

    this.savingProducao = true;
    this.producaoService.registrarProducao(this.quantidadeInput).subscribe({
      next: (producao) => {
        this.producao = producao;
        this.savingProducao = false;
        this.producaoMensagem = 'Produção do dia salva com sucesso!';
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.savingProducao = false;
        this.producaoErro = err?.error?.erro || 'Erro ao salvar a produção do dia.';
        this.cdr.markForCheck();
      },
    });
  }

  loadStats(): void {
    this.loading = true;

    this.clienteService.getTotal().subscribe({
      next: (total) => {
        this.totalClientes = total;
        this.cdr.markForCheck();
      },
      error: () => {},
    });

    this.clienteService.getReceberam().subscribe({
      next: (total) => {
        this.totalReceberam = total;
        this.cdr.markForCheck();
      },
      error: () => {},
    });

    this.clienteService.getNaoReceberam().subscribe({
      next: (total) => {
        this.totalNaoReceberam = total;
        this.cdr.markForCheck();
      },
      error: () => {},
    });

    this.retiradaService.getEstatisticas().subscribe({
      next: (stats) => {
        this.totalRetiradas = stats.total_retiradas;
        this.totalMoradoresRua = stats.total_moradores_rua;
        this.cdr.markForCheck();
      },
      error: () => {},
    });

    this.retiradaService.getRelatorioDiario().subscribe({
      next: (relatorio) => {
        this.relatorioDiario = relatorio;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
