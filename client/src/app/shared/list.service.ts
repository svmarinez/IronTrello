import { IronTrelloGenericResponse } from './interfaces';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, of } from 'rxjs';
import { SortableItem } from '../shared/interfaces/sortable-items.interface';
import { map, catchError } from 'rxjs/operators';
import { List } from '../components/list/list.model';
import { Card } from '../components/card/card.model';
import { _ } from 'lodash';
import { CardService } from './card.service';

@Injectable()
export class ListService {
  LIST_ROUTE = '/list';
  ENDPOINT: string;
  lists: Array<SortableItem> = [];

  constructor(
    @Inject('BASE_ENDPOINT') private BASE,
    @Inject('API_ENDPOINT') private API,
    private cardService: CardService,
    private http: Http
  ) {
    this.ENDPOINT = this.BASE + this.API;
  }

  errorHandler(e) {
    console.log(e.message);
    console.log(e);
    return e;
  }

  get(): Observable<SortableItem[]> {
    return this.http.get(`${this.ENDPOINT}${this.LIST_ROUTE}/`)
      .pipe(map((res) => res.json()))
      .pipe(map((res) => {
        for (const list of res) {
          this.lists.push(new List(list));
        }

        this.lists = this.sortItems(this.lists);
        return this.lists;
      }));
      catchError(e => of(this.errorHandler(e)));
  }

  private getNextPosition(): number {
    if (this.lists.length !== 0) {
      const pos = _.last(this.lists).position;
      return pos + 1000;
    } else {
      return 0;
    }
  }

  private sortItems(items: Array<SortableItem>): Array<SortableItem> {
    return _.orderBy(items, ['position', 'title']);
  }

  create(list): Observable<Array<SortableItem>> {
    list.position = this.getNextPosition();

    return this.http.post(`${this.ENDPOINT}${this.LIST_ROUTE}/`, list)
      .pipe(map((res) => res.json()))
      .pipe(map((newList) => {
        this.lists.push(new List(newList));
        this.lists = this.sortItems(this.lists);
        return this.lists;
      }));
      catchError(e => of(this.errorHandler(e)));
  }

  createCard(card, listId: string): Observable<Array<SortableItem>> {
    return this.cardService.create(card)
      .pipe(map((newCard: Card) => {
        const list = (_.find(this.lists, { _id: listId })) as List;
        return list.addCard(newCard);
      }));
    }

  edit(list: SortableItem): Observable<IronTrelloGenericResponse> {
    return this.http.put(`${this.ENDPOINT}${this.LIST_ROUTE}/${list._id}`, list)
      .pipe(map((res) => res.json()));
      catchError(e => of(this.errorHandler(e)));
  }

  remove(list: SortableItem): Observable<IronTrelloGenericResponse> {
    return this.http.delete(`${this.ENDPOINT}${this.LIST_ROUTE}/${list._id}`)
      .pipe(map((res) => res.json()));
      catchError(e => of(this.errorHandler(e)));
  }

  shiftCard(sourceList, targetList, cardId): void {
    const sList = _.find(this.lists, { _id: sourceList }) as List;
    const tList = _.find(this.lists, { _id: targetList }) as List;
    const _index = _.findIndex(tList.cards, { _id: cardId }) as number;
    const _el = _.find(tList.cards, { _id: cardId }) as Card;

    if (_index !== -1) {
      if (_index === 0) {
        if (tList.cards.length > 1) {
          _el.position = tList.cards[1].position - 1000;
        } else {
          _el.position = 0;
        }
      } else {
        if (tList.cards[_index - 1] && tList.cards[_index + 1]) {
          _el.position = (tList.cards[_index - 1].position + tList.cards[_index + 1].position) / 2;
        } else {
          _el.position = tList.cards[_index - 1].position + 1000;
        }
      }

      // Update with the latest list id
      _el.setList(tList._id);

      if (sourceList === targetList) {
        const subscription = this.cardService.edit(_el).subscribe(
          (res) => console.log('Card position updated', res),
          (err) => console.log('Update card error', err)
        );
      } else {
        const subscription = this.cardService.transfer(_el, sourceList, targetList).subscribe(
          (res) => console.log('Card position updated', res),
          (err) => console.log('Update card error', err)
        );
      }
    }

    tList.cards = this.sortItems(tList.cards) as Card[];
  }

  shiftList(listId): void {
    const _index = _.findIndex(this.lists, { _id: listId });
    const _el = _.find(this.lists, { _id: listId }) as List;

    if (_index !== -1) {
      if (_index === 0) {
        if (this.lists.length > 1) {
          _el.position = this.lists[1].position - 1000;
        } else {
          _el.position = 0;
        }
      } else {
        if (this.lists[_index - 1] && this.lists[_index + 1]) {
          _el.position = (this.lists[_index - 1].position + this.lists[_index + 1].position) / 2;
        } else {
          _el.position = this.lists[_index - 1].position + 1000;
        }
      }

      const subscription = this.edit(_el).subscribe(
        (res) => console.log('Update list position', res),
        (err) => console.log('Update list error', err)
      );
    }
  }
}
