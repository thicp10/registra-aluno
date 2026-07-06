import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RetiradaService } from '../../services/retirada.service';
import { Retirada, MoradorRua, RetiradaRequest } from '../../models/retirada.model';

@Component({
  selector: 'app-retiradas',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './retiradas.component.html',
  styleUrl: './retiradas.component.css',
})
export class RetiradasComponent implements OnInit {
  private readonly retiradaService = inject(RetiradaService);
  private readonly cdr = inject(ChangeDetectorRef);

  retiradas: Retirada[] = [];
  moradoresRua: MoradorRua[] = [];
  loading = true;
  activeTab: 'registrar' | 'lista' | 'moradores' = 'registrar';

  successMessage = '';
  errorMessage = '';

  tipoRegistro: 'codigo' | 'nome' | 'rg' | 'moradorRua' = 'codigo';
  formData: RetiradaRequest = {};

  ngOnInit(): void {
    this.loadRetiradas();
    this.loadMoradoresRua();
  }

  loadRetiradas(): void {
    this.loading = true;
    this.retiradaService.listarTodas().subscribe({
      next: (retiradas) => {
        this.retiradas = retiradas;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar retiradas';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadMoradoresRua(): void {
    this.retiradaService.listarMoradoresRua().subscribe({
      next: (moradores) => {
        this.moradoresRua = moradores;
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  registrarRetirada(): void {
    this.clearMessages();

    const request: RetiradaRequest = {};

    switch (this.tipoRegistro) {
      case 'codigo':
        if (!this.formData.codigo?.trim()) {
          this.errorMessage = 'Informe o código do cliente';
          return;
        }
        request.codigo = this.formData.codigo.trim();
        break;
      case 'nome':
        if (!this.formData.nome?.trim()) {
          this.errorMessage = 'Informe o nome do cliente';
          return;
        }
        request.nome = this.formData.nome.trim();
        break;
      case 'rg':
        if (!this.formData.rg?.trim()) {
          this.errorMessage = 'Informe o RG do cliente';
          return;
        }
        request.rg = this.formData.rg.trim();
        break;
      case 'moradorRua':
        if (!this.formData.nome?.trim()) {
          this.errorMessage = 'Informe o nome do morador de rua';
          return;
        }
        request.moradorRua = 'true';
        request.nome = this.formData.nome.trim();
        request.rg = this.formData.rg?.trim();
        request.descricao = this.formData.descricao?.trim();
        break;
    }

    this.retiradaService.registrarRetirada(request).subscribe({
      next: (response) => {
        this.successMessage = response.mensagem || 'Retirada registrada com sucesso!';
        this.formData = {};
        this.cdr.markForCheck();
        this.loadRetiradas();
        this.loadMoradoresRua();
      },
      error: (err) => {
        this.errorMessage = err.error?.erro || 'Erro ao registrar retirada';
        this.cdr.markForCheck();
      },
    });
  }

  exportarExcel(): void {
    this.retiradaService.exportarExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'retiradas.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.errorMessage = 'Erro ao exportar Excel';
        this.cdr.markForCheck();
      },
    });
  }

  exportarRelatorioDiario(): void {
    this.retiradaService.exportarRelatorioDiarioExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio_diario.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.errorMessage = 'Erro ao exportar relatório diário';
        this.cdr.markForCheck();
      },
    });
  }

  setTab(tab: 'registrar' | 'lista' | 'moradores'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  onTipoChange(): void {
    this.formData = {};
    this.clearMessages();
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
