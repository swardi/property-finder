import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx'; 

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SearchService {
	
    constructor(private http: Http ) {}
    search(){
         return this.http.get('assets/response.json').toPromise();
    }

} 