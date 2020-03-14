import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDireccion, Direccion } from 'app/shared/model/direccion.model';
import { DireccionService } from './direccion.service';
import { IDepartamento } from 'app/shared/model/departamento.model';
import { DepartamentoService } from 'app/entities/departamento/departamento.service';

@Component({
  selector: 'jhi-direccion-update',
  templateUrl: './direccion-update.component.html'
})
export class DireccionUpdateComponent implements OnInit {
  isSaving = false;
  departamentos: IDepartamento[] = [];

  editForm = this.fb.group({
    id: [],
    calle: [],
    codigoPostal: [],
    ciudad: [],
    provincia: [],
    departamento: []
  });

  constructor(
    protected direccionService: DireccionService,
    protected departamentoService: DepartamentoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ direccion }) => {
      this.updateForm(direccion);

      this.departamentoService
        .query({ filter: 'direccion-is-null' })
        .pipe(
          map((res: HttpResponse<IDepartamento[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IDepartamento[]) => {
          if (!direccion.departamento || !direccion.departamento.id) {
            this.departamentos = resBody;
          } else {
            this.departamentoService
              .find(direccion.departamento.id)
              .pipe(
                map((subRes: HttpResponse<IDepartamento>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IDepartamento[]) => (this.departamentos = concatRes));
          }
        });
    });
  }

  updateForm(direccion: IDireccion): void {
    this.editForm.patchValue({
      id: direccion.id,
      calle: direccion.calle,
      codigoPostal: direccion.codigoPostal,
      ciudad: direccion.ciudad,
      provincia: direccion.provincia,
      departamento: direccion.departamento
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const direccion = this.createFromForm();
    if (direccion.id !== undefined) {
      this.subscribeToSaveResponse(this.direccionService.update(direccion));
    } else {
      this.subscribeToSaveResponse(this.direccionService.create(direccion));
    }
  }

  private createFromForm(): IDireccion {
    return {
      ...new Direccion(),
      id: this.editForm.get(['id'])!.value,
      calle: this.editForm.get(['calle'])!.value,
      codigoPostal: this.editForm.get(['codigoPostal'])!.value,
      ciudad: this.editForm.get(['ciudad'])!.value,
      provincia: this.editForm.get(['provincia'])!.value,
      departamento: this.editForm.get(['departamento'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDireccion>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IDepartamento): any {
    return item.id;
  }
}
