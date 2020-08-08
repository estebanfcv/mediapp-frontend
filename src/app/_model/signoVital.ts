import { Paciente } from './paciente';

export class SignoVital{
    idSignoVital: number;
    temperatura: string;
    pulso: string;
    ritmoRespiratorio: string;
    fecha: string;
    paciente: Paciente;
}