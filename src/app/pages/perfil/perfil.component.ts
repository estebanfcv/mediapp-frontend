import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../../_model/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

public usuario: Usuario;

  constructor() { }

  ngOnInit(): void {
    this.usuario = new Usuario();
    this.mostrarPerfilUsuario();
  }

  mostrarPerfilUsuario(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    console.log(decodedToken);
    this.usuario.username= decodedToken.user_name;
    this.usuario.roles=decodedToken.authorities;
    console.log(this.usuario);
  }

}
