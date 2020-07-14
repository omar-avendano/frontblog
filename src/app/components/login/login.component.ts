import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from "@angular/router";
import { User } from '../../models/user';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent implements OnInit {
  public page_title:string;
  public user:User;
  public status:string;
  public token;
  public identity;

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _route:ActivatedRoute
  ) {
    this.page_title='Identificate';
    this.user= new User(1,'','','','','ROLE_USER','','');
  }

  ngOnInit(): void {
    //Esto se ejecuta siempre y cierra session cuando le llega el parametro sure por la url
    this.logout();
  }

  onSubmit(form){
    //console.log(this.user);
    this._userService.signup(this.user).subscribe(
      response=>{
        //console.log(response);
        //Optener Token
        if(response.status!='error'){
          this.status='success';
          this.token=response;
          //Obtener datos de usuario identificado
          this._userService.signup(this.user,true).subscribe(
            response=>{
              //Optener Token
                this.identity=response;         
                
                //Persistir datos de usuario identificado
                // console.log(this.token);
                // console.log(this.identity);
                localStorage.setItem('token',this.token);
                localStorage.setItem('identity',JSON.stringify(this.identity));
                //Redirigir al inicio
                this._router.navigate(['inicio']);
            },
            error=>{
              this.status='error';
              console.log(<any>error);
            }
          );

        }else{
          this.status='error';
        }
        
      },
      error=>{
        this.status='error';
        console.log(<any>error);
      }
    );


  }

  logout(){
    this._route.params.subscribe(
      params=>{
        let logout = +params['sure']; // Optengo sure y lo casteo a string

        if(logout==1){
          //Borrar localStorage
          localStorage.removeItem('identity');
          localStorage.removeItem('token');
          //Poner Null variables de session
          this.identity=null;
          this.token=null;
          //Redirigir al inicio
          this._router.navigate(['inicio']);
        }
      }
    );

  }


}
