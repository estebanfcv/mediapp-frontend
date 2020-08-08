import { Component, OnInit } from '@angular/core';
import { SignoVital } from '../../../_model/signoVital';
import { FormGroup, FormControl } from '@angular/forms';
import { SignoVitalService } from '../../../_service/signo-vital.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Paciente } from '../../../_model/paciente';
import { Observable } from 'rxjs';
import { PacienteService } from '../../../_service/paciente.service';
import { MatDialog } from '@angular/material/dialog';
import { PacienteDialogoComponent } from '../../paciente/paciente-dialogo/paciente-dialogo.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-signo-vital-edicion',
  templateUrl: './signo-vital-edicion.component.html',
  styleUrls: ['./signo-vital-edicion.component.css']
})
export class SignoVitalEdicionComponent implements OnInit {

  id: number;
  signoVital: SignoVital;
  form: FormGroup;
  edicion: boolean = false;
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  // AUTO COMPLETE
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados: Observable<Paciente[]>;
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente;
  existePaciente: boolean = false;

  paciente = new Paciente();

  constructor(
    private pacienteService: PacienteService,
    private signoVitalService: SignoVitalService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.pacienteService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'aviso', {
        duration: 3000,
      });
    });


    this.signoVital = new SignoVital();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo respiratorio': new FormControl(''),
      'fecha': new FormControl(new Date())
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });

    this.listarPacientes();

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  initForm() {
    if (this.edicion) {
      this.existePaciente = true;
      this.signoVitalService.listarPorId(this.id).subscribe(data => {


        let id = data.idSignoVital;
        let paciente = data.paciente;
        let temperatura = data.temperatura;
        let pulso = data.pulso;
        let ritmoRespiratorio = data.ritmoRespiratorio;
        let fecha = data.fecha;
        this.myControlPaciente = new FormControl(paciente);
        console.log(this.myControlPaciente);
        this.form = new FormGroup({
          'id': new FormControl(id),
          'paciente': this.myControlPaciente,
          'temperatura': new FormControl(temperatura),
          'pulso': new FormControl(pulso),
          'ritmo respiratorio': new FormControl(ritmoRespiratorio),
          'fecha': new FormControl(fecha)
        });
        this.listarPacientes();

        this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
      });
    }
  }

  operar() {
    this.signoVital.idSignoVital = this.form.value['id'];
    this.signoVital.temperatura = this.form.value['temperatura'];
    this.signoVital.pulso = this.form.value['pulso'];
    this.signoVital.ritmoRespiratorio = this.form.value['ritmo respiratorio'];
    this.signoVital.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    if (!this.signoVital.paciente) {
      this.signoVital.paciente = this.form.value['paciente'];
    }
    if (this.signoVital != null && this.signoVital.idSignoVital > 0) { // MODIFIACION

      //BUENA PRACTICA
      this.signoVitalService.modificar(this.signoVital).pipe(switchMap(() => {
        return this.signoVitalService.listar();
      })).subscribe(data => {
        this.signoVitalService.signoVitalCambio.next(data);
        this.signoVitalService.mensajeCambio.next("Se modificó");
      });

    } else { // INSERCION
      //BUENA PRACTICA
      this.signoVitalService.registrar(this.signoVital).pipe(switchMap(() => {
        return this.signoVitalService.listar();
      })).subscribe(data => {
        this.signoVitalService.signoVitalCambio.next(data);
        this.signoVitalService.mensajeCambio.next("Se registró");
      });
    }
    this.myControlPaciente.reset();
    this.router.navigate(['signovital']);
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  registro() {
    if (!this.form.value['paciente']?.nombres) {
      this.paciente.nombres = this.form.value['paciente'];
      this.dialog.open(PacienteDialogoComponent, {
        width: '250px',
        data: this
      });
    } else {
      this.signoVitalService.mensajeCambio.next("El paciente ya existe");
      console.log('El paciente ya existe');
    }
  }
}
