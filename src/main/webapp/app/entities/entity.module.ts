import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'direccion',
        loadChildren: () => import('./direccion/direccion.module').then(m => m.GolmirjhDireccionModule)
      },
      {
        path: 'departamento',
        loadChildren: () => import('./departamento/departamento.module').then(m => m.GolmirjhDepartamentoModule)
      },
      {
        path: 'empleado',
        loadChildren: () => import('./empleado/empleado.module').then(m => m.GolmirjhEmpleadoModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class GolmirjhEntityModule {}
