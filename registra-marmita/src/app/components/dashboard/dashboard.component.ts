import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { RetiradaService } from '../../services/retirada.service';
import { RelatorioDiario } from '../../models/retirada.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly retiradaService = inject(RetiradaService);

  totalClientes = 0;
  totalReceberam = 0;
  totalNaoReceberam = 0;
  totalRetiradas = 0;
  totalMoradoresRua = 0;
  relatorioDiario: RelatorioDiario | null = null;
  loading = true;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    this.clienteService.getTotal().subscribe({
      next: (total) => (this.totalClientes = total),
      error: () => {},
    });

    this.clienteService.getReceberam().subscribe({
      next: (total) => (this.totalReceberam = total),
      error: () => {},
    });

    this.clienteService.getNaoReceberam().subscribe({
      next: (total) => (this.totalNaoReceberam = total),
      error: () => {},
    });

    this.retiradaService.getEstatisticas().subscribe({
      next: (stats) => {
        this.totalRetiradas = stats.total_retiradas;
        this.totalMoradoresRua = stats.total_moradores_rua;
      },
      error: () => {},
    });

    this.retiradaService.getRelatorioDiario().subscribe({
      next: (relatorio) => {
        this.relatorioDiario = relatorio;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
