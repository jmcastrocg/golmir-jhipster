import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IEmpleado, Empleado } from 'app/shared/model/empleado.model';
import { EmpleadoService } from './empleado.service';
import { IDireccion } from 'app/shared/model/direccion.model';
import { DireccionService } from 'app/entities/direccion/direccion.service';

@Component({
  selector: 'jhi-empleado-update',
  templateUrl: './empleado-update.component.html'
})
export class EmpleadoUpdateComponent implements OnInit {
  isSaving = false;
  direccions: IDireccion[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [],
    apellido: [],
    email: [],
    numeroTelefono: [],
    fechaContratacion: [],
    direccion: []
  });

  constructor(
    protected empleadoService: EmpleadoService,
    protected direccionService: DireccionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ empleado }) => {
      if (!empleado.id) {
        const today = moment().startOf('day');
        empleado.fechaContratacion = today;
      }

      this.updateForm(empleado);

      this.direccionService
        .query({ filter: 'empleado-is-null' })
        .pipe(
          map((res: HttpResponse<IDireccion[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IDireccion[]) => {
          if (!empleado.direccion || !empleado.direccion.id) {
            this.direccions = resBody;
          } else {
            this.direccionService
              .find(empleado.direccion.id)
              .pipe(
                map((subRes: HttpResponse<IDireccion>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IDireccion[]) => (this.direccions = concatRes));
          }
        });
    });
  }

  updateForm(empleado: IEmpleado): void {
    this.editForm.patchValue({
      id: empleado.id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      email: empleado.email,
      numeroTelefono: empleado.numeroTelefono,
      fechaContratacion: empleado.fechaContratacion ? empleado.fechaContratacion.format(DATE_TIME_FORMAT) : null,
      direccion: empleado.direccion
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const empleado = this.createFromForm();
    if (empleado.id !== undefined) {
      this.subscribeToSaveResponse(this.empleadoService.update(empleado));
    } else {
      this.subscribeToSaveResponse(this.empleadoService.create(empleado));
    }
  }

  private createFromForm(): IEmpleado {
    return {
      ...new Empleado(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellido: this.editForm.get(['apellido'])!.value,
      email: this.editForm.get(['email'])!.value,
      numeroTelefono: this.editForm.get(['numeroTelefono'])!.value,
      fechaContratacion: this.editForm.get(['fechaContratacion'])!.value
        ? moment(this.editForm.get(['fechaContratacion'])!.value, DATE_TIME_FORMAT)
        : undefined,
      direccion: this.editForm.get(['direccion'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmpleado>>): void {
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

  trackById(index: number, item: IDireccion): any {
    return item.id;
  }
}
