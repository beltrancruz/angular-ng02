import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private _apikey: string  = 'PYTIjoHteqBKIrSZukjMq99GvQQllt7J';
  private _baseurl: string = 'https://api.giphy.com/v1/gifs'
  private _history: string[] = [];
  

  public results:Gif[] = [];

  constructor (private _http:HttpClient) {
    let arrayHistory = localStorage.getItem('history') || '[]';
    this._history = JSON.parse(arrayHistory);

    let arrayResults = localStorage.getItem('results') || '[]';
    this.results = JSON.parse(arrayResults);
  }

  get history():string[]{
    return [...this._history];
  }

  searchGifs(query:string):void{
    query = query.trim().toLowerCase();

    const params = new HttpParams()
    .set('api_key',this._apikey)
    .set('limit',10)
    .set('q',query);

    this._http.get<SearchGifsResponse>(`${this._baseurl}/search`, { params })
    .subscribe((res)=>{
      this.results = res.data;
      localStorage.setItem('results',JSON.stringify(this.results));
    })


    if(query.length == 0 || this._history.includes(query)){
      return;
    }

    const lenght = this._history.unshift(query);
    if(lenght > 10){
      this._history.pop();
    }

    localStorage.setItem('history',JSON.stringify(this._history));



  }

}
