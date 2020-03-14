import { Moment } from 'moment';
import { IDireccion } from 'app/shared/model/direccion.model';

export interface IEmpleado {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  numeroTelefono?: string;
  fechaContratacion?: Moment;
  direccion?: IDireccion;
}

export class Empleado implements IEmpleado {
  constructor(
    public id?: number,
    public nombre?: string,
    public apellido?: string,
    public email?: string,
    public numeroTelefono?: string,
    public fechaContratacion?: Moment,
    public direccion?: IDireccion
  ) {}
}
