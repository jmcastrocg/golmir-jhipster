export interface IDepartamento {
  id?: number;
  nombreDepartamento?: string;
}

export class Departamento implements IDepartamento {
  constructor(public id?: number, public nombreDepartamento?: string) {}
}
