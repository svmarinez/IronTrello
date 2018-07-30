import { IronTrelloGenericResponse } from './interfaces';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Card } from '../components/card/card.model';


@Injectable()
export class CardService {

  CARD_ROUTE = '/card';
  ENDPOINT: string;
  cards: Array<Card> = [];

  constructor(
    @Inject('BASE_ENDPOINT') private BASE,
    @Inject('API_ENDPOINT') private API,
    private http: Http
  ) {
    this.ENDPOINT = this.BASE + this.API;
  }

  errorHandler(e) {
    console.log(e.message);
    console.log(e);
    return e;
  }

  create(card): Observable<Card> {
    return this.http.post(`${this.ENDPOINT}${this.CARD_ROUTE}/`, card)
      .pipe(map((res) => res.json()))
      .pipe(map((newCard) => new Card(newCard)));
      catchError(e => of(this.errorHandler(e)));
  }

  edit(card: Card) {
    return this.http.put(`${this.ENDPOINT}${this.CARD_ROUTE}/${card._id}`, card)
      .pipe(map((res) => res.json().card))
      .pipe(map((_card) => {
        card = new Card(_card);
        return card;
      }));
      catchError(e => of(this.errorHandler(e)));
  }

  transfer(card: Card, from, to) {
    const body = {
      card,
      from,
      to
    };

    return this.http.put(`${this.ENDPOINT}${this.CARD_ROUTE}/${card._id}/transfer`, body)
      .pipe(map((res) => res.json()));
      catchError(e => of(this.errorHandler(e)));
  }

  remove(card: Card): Observable<IronTrelloGenericResponse> {
    return this.http.delete(`${this.ENDPOINT}${this.CARD_ROUTE}/${card._id}`)
      .pipe(map((res) => res.json()));
      catchError(e => of(this.errorHandler(e)));
  }
}
