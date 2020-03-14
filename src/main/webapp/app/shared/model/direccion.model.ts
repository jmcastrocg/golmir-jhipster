import { IDepartamento } from 'app/shared/model/departamento.model';

export interface IDireccion {
  id?: number;
  calle?: string;
  codigoPostal?: string;
  ciudad?: string;
  provincia?: string;
  departamento?: IDepartamento;
}

export class Direccion implements IDireccion {
  constructor(
    public id?: number,
    public calle?: string,
    public codigoPostal?: string,
    public ciudad?: string,
    public provincia?: string,
    public departamento?: IDepartamento
  ) {}
}
