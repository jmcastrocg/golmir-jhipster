import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IEmpleado, Empleado } from 'app/shared/model/empleado.model';
import { EmpleadoService } from './empleado.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
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
    titulo: [],
    fechaContratacion: [],
    foto: [null, [Validators.required]],
    fotoContentType: [],
    direccion: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected empleadoService: EmpleadoService,
    protected direccionService: DireccionService,
    protected elementRef: ElementRef,
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
      titulo: empleado.titulo,
      fechaContratacion: empleado.fechaContratacion ? empleado.fechaContratacion.format(DATE_TIME_FORMAT) : null,
      foto: empleado.foto,
      fotoContentType: empleado.fotoContentType,
      direccion: empleado.direccion
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('golmirjhApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
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
      titulo: this.editForm.get(['titulo'])!.value,
      fechaContratacion: this.editForm.get(['fechaContratacion'])!.value
        ? moment(this.editForm.get(['fechaContratacion'])!.value, DATE_TIME_FORMAT)
        : undefined,
      fotoContentType: this.editForm.get(['fotoContentType'])!.value,
      foto: this.editForm.get(['foto'])!.value,
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
