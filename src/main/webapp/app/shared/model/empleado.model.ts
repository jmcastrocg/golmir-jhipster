import { Moment } from 'moment';
import { IDireccion } from 'app/shared/model/direccion.model';

export interface IEmpleado {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  numeroTelefono?: string;
  titulo?: string;
  fechaContratacion?: Moment;
  fotoContentType?: string;
  foto?: any;
  direccion?: IDireccion;
}

export class Empleado implements IEmpleado {
  constructor(
    public id?: number,
    public nombre?: string,
    public apellido?: string,
    public email?: string,
    public numeroTelefono?: string,
    public titulo?: string,
    public fechaContratacion?: Moment,
    public fotoContentType?: string,
    public foto?: any,
    public direccion?: IDireccion
  ) {}
}
