import { Injectable } from "../../../node_modules/@angular/core";
import { Http, Response } from "../../../node_modules/@angular/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class DataStorageService {
    constructor(
        private http: Http,
        private recipeService: RecipeService,   
        private authService: AuthService) {}

    storeRecipes() {
        const token = this.authService.getToken();
        this.http.put(
            'https://recipe-book-f454a.firebaseio.com/recipes.json?auth=' + token, 
            this.recipeService.getRecipes()).subscribe(
                (response: Response) => {
                  console.log(response);
            }
        );
    }

    getRecipes() {
        const token = this.authService.getToken();
        return this.http.get('https://recipe-book-f454a.firebaseio.com/recipes.json?auth=' + token).pipe(
            map(
                (response: Response) => {
                    const recipes: Recipe[] = response.json();
                    for(let rec of recipes) {
                        if(!rec.ingredients) {
                            rec.ingredients = [];
                        }
                    }
                    return recipes;
                }
            )
        )
        .subscribe(
            (recipes: Recipe[]) => {
                this.recipeService.setRecipes(recipes);
            }
        );
    }

}