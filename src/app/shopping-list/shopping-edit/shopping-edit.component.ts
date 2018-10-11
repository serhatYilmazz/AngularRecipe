import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') sLForm: NgForm;
  subscription: Subscription;
  editingItem: Ingredient;
  editingItemIndex: number;
  editMode: boolean = false;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.isEditingMode.subscribe(
      (index: number) => {
        this.editingItem = this.slService.getIngredient(index);
        this.editingItemIndex = index; 
        this.editMode = true;
        this.sLForm.setValue({
          name: this.editingItem.name,
          amount: this.editingItem.amount
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    const ingName = form.value.name;
    const ingAmount = form.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    if(this.editMode){
      this.slService.updateIngredient(this.editingItemIndex, newIngredient);
    }
    else{
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    this.sLForm.reset(); 
  }

  onClear(){  
    this.sLForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.slService.deleteIngredient(this.editingItemIndex);
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
