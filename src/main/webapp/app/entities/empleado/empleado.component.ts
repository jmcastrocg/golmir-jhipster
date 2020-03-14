import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmpleado } from 'app/shared/model/empleado.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { EmpleadoService } from './empleado.service';
import { EmpleadoDeleteDialogComponent } from './empleado-delete-dialog.component';

@Component({
  selector: 'jhi-empleado',
  templateUrl: './empleado.component.html'
})
export class EmpleadoComponent implements OnInit, OnDestroy {
  empleados: IEmpleado[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected empleadoService: EmpleadoService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.empleados = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.empleadoService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IEmpleado[]>) => this.paginateEmpleados(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.empleados = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInEmpleados();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IEmpleado): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInEmpleados(): void {
    this.eventSubscriber = this.eventManager.subscribe('empleadoListModification', () => this.reset());
  }

  delete(empleado: IEmpleado): void {
    const modalRef = this.modalService.open(EmpleadoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.empleado = empleado;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateEmpleados(data: IEmpleado[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.empleados.push(data[i]);
      }
    }
  }
}
