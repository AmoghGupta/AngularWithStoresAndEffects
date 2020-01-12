import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { LoadShoppingAction, ShoppingActionTypes, LoadShoppingSuccessAction, LoadShoppingFailureAction, AddItemAction, AddItemSuccessAction, AddItemFailureAction, DeleteItemAction, DeleteItemSuccessAction, DeleteItemFailureAction } from '../actions/shopping.actions'
import { of } from 'rxjs';
import { ShoppingService } from 'src/app/shopping.service';

@Injectable()
export class ShoppingEffects {

  constructor( private actions$: Actions,private shoppingService: ShoppingService) {
  }


  @Effect() loadShopping$ = this.actions$
    .pipe(
      ofType<LoadShoppingAction>(ShoppingActionTypes.LOAD_SHOPPING),
      mergeMap(
        () => this.shoppingService.getShoppingItems()
          .pipe(
            map((resp) => {
              return new LoadShoppingSuccessAction(resp)
            }),
            catchError(error => of(new LoadShoppingFailureAction(error)))
          )
      ),
  );



  @Effect() addShoppingItem$ = this.actions$
    .pipe(
      //match action ofType AddItemAction with type ShoppingActionTypes.ADD_ITEM
      ofType<AddItemAction>(ShoppingActionTypes.ADD_ITEM),
      mergeMap(
        //outside observable emits "action" which we use here
        (action) => this.shoppingService.addShoppingItem(action.payload)
          .pipe(
            //outside observable emits "response" of the api
            map((response) => new AddItemSuccessAction(action.payload)),
            catchError(error => of(new AddItemFailureAction(error)))
          )
      )
  );

  @Effect() deleteShoppingItem$ = this.actions$
    .pipe(
      ofType<DeleteItemAction>(ShoppingActionTypes.DELETE_ITEM),
      mergeMap(
        (action) => this.shoppingService.deleteShoppingItem(action.payload)
          .pipe(
            map((response) => new DeleteItemSuccessAction(action.payload)),
            catchError(error => of(new DeleteItemFailureAction(error)))
          )
      )
    );


}
