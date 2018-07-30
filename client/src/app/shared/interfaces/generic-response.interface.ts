import { List } from '../../../../../server/api/list/list.model';
import { Card } from '../../../../../server/api/card/card.model';

export interface IronTrelloGenericResponse {
   message: string;
   error?: string;
   list?: List;
   card?: Card;
}
