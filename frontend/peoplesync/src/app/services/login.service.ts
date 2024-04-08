import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import {Token,SesionActica} from "../interfaces/token.interface.js";
import {BACKEND} from "../config/Config.js";

@Injectable({
    providedIn: 'root'
  })
export class LoginService {
    private path: string =BACKEND+"/api/users/authenticate";

    constructor(private http: HttpClient) { }

    login(username: string, password: string):Observable<Token> {
        return this.http.post<Token>(this.path, {username: username, password: password})
    }
    checkToken():Observable<SesionActica>{
        const token = localStorage.getItem('token');
        const httpOptions ={
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.get<SesionActica>(this.path, httpOptions);
    }
}