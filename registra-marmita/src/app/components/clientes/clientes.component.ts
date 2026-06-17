import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly cdr = inject(ChangeDetectorRef);

  clientes: Cliente[] = [];
  loading = true;
  showForm = false;
  editing = false;
  successMessage = '';
  errorMessage = '';
  searchTerm = '';

  formData: Cliente = {
    nome: '',
    endereco: '',
    rg: '',
    data: '',
    recebeu: false,
  };

  private editingId: number | null = null;

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    this.clienteService.findAll().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar clientes';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.loadClientes();
      return;
    }
    this.loading = true;
    this.clienteService.findByNome(this.searchTerm).subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Erro na busca';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openCreateForm(): void {
    this.formData = { nome: '', endereco: '', rg: '', data: '', recebeu: false };
    this.editingId = null;
    this.editing = false;
    this.showForm = true;
    this.clearMessages();
  }

  openEditForm(cliente: Cliente): void {
    this.formData = { ...cliente };
    this.editingId = cliente.id ?? null;
    this.editing = true;
    this.showForm = true;
    this.clearMessages();
  }

  closeForm(): void {
    this.showForm = false;
    this.clearMessages();
  }

  saveCliente(): void {
    if (!this.formData.nome || !this.formData.endereco || !this.formData.data) {
      this.errorMessage = 'Preencha os campos obrigatórios (Nome, Endereço, Data)';
      this.cdr.markForCheck();
      return;
    }

    this.clearMessages();

    if (this.editing && this.editingId !== null) {
      this.clienteService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Cliente atualizado com sucesso!';
          this.showForm = false;
          this.cdr.markForCheck();
          this.loadClientes();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.error || 'Erro ao atualizar cliente';
          this.cdr.markForCheck();
        },
      });
    } else {
      this.clienteService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Cliente criado com sucesso!';
          this.showForm = false;
          this.cdr.markForCheck();
          this.loadClientes();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.error || 'Erro ao criar cliente';
          this.cdr.markForCheck();
        },
      });
    }
  }

  deleteCliente(id: number | undefined): void {
    if (id === undefined) return;
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    this.clearMessages();
    this.clienteService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Cliente excluído com sucesso!';
        this.cdr.markForCheck();
        this.loadClientes();
      },
      error: () => {
        this.errorMessage = 'Erro ao excluir cliente';
        this.cdr.markForCheck();
      },
    });
  }

  exportExcel(): void {
    this.clienteService.exportExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clientes.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.errorMessage = 'Erro ao exportar Excel';
        this.cdr.markForCheck();
      },
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
