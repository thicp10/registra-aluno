import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../services/aluno.service';
import { Aluno } from '../model/aluno.model';

@Component({
  selector: 'app-aluno-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aluno-list.component.html'
})
export class AlunoListComponent implements OnInit {
  private alunoService = inject(AlunoService);
  alunos: Aluno[] = [];

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos() {
    this.alunoService.getAlunos().subscribe({
      next: (dados) => this.alunos = dados,
      error: (erro) => console.error('Erro ao buscar alunos', erro)
    });
  }

  deletarAluno(id: number) {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.alunoService.deleteAluno(id).subscribe(() => {
        this.carregarAlunos();
      });
    }
  }
}
