import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SignoVital } from '../../_model/signoVital';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SignoVitalService } from '../../_service/signo-vital.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signo-vital',
  templateUrl: './signo-vital.component.html',
  styleUrls: ['./signo-vital.component.css']
})
export class SignoVitalComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['id', 'paciente', 'temperatura', 'pulso', 'ritmo respiratorio', 'fecha','acciones'];
  dataSource: MatTableDataSource<SignoVital>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private signoVitalService: SignoVitalService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.signoVitalService.signoVitalCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signoVitalService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'aviso', {
        duration: 3000,
      });
    });

    this.signoVitalService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });

  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(signoVital: SignoVital) {
    this.signoVitalService.eliminar(signoVital.idSignoVital).pipe(switchMap(() => {
      return this.signoVitalService.listar();
    })).subscribe(data => {
      this.signoVitalService.signoVitalCambio.next(data);
      this.signoVitalService.mensajeCambio.next('Se eliminó');
    });
  }

  mostrarMas(e: any) {
    this.signoVitalService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

}
