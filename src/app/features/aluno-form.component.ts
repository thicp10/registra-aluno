import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AlunoService } from '../services/aluno.service';
import { Aluno } from '../model/aluno.model';

@Component({
  selector: 'app-aluno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './aluno-form.component.html'
})
export class AlunoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alunoService = inject(AlunoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  isEditMode = false;
  alunoId?: number;

  constructor() {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      matricula: ['', Validators.required],
      curso: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.alunoId = +id;
      this.alunoService.getAluno(this.alunoId).subscribe(aluno => {
        this.form.patchValue(aluno);
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const aluno: Aluno = this.form.value;

    if (this.isEditMode && this.alunoId) {
      this.alunoService.updateAluno(this.alunoId, aluno).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.alunoService.createAluno(aluno).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}