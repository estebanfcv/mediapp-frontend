import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paciente } from '../../../_model/paciente';
import { PacienteService } from '../../../_service/paciente.service';
import { switchMap } from 'rxjs/operators';
import { SignoVitalEdicionComponent } from '../../signo-vital/signo-vital-edicion/signo-vital-edicion.component';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente: Paciente;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SignoVitalEdicionComponent,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.paciente = new Paciente();
    this.paciente.nombres = this.data.paciente.nombres;
  }

  operar() {
    //REGISTRAR
    this.pacienteService.registrar(this.paciente).subscribe(data => {
      this.paciente = data as Paciente;
      this.data.listarPacientes();
      this.data.signoVital.paciente = this.paciente;
      this.pacienteService.mensajeCambio.next("Se registró");
    });
    this.cancelar();
  }

  cancelar() {
    this.dialogRef.close();
  }

}
