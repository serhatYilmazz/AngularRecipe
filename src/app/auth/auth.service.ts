import * as firebase from 'firebase';
import { Injectable } from '../../../node_modules/@angular/core';
import { Router } from '../../../node_modules/@angular/router';

@Injectable()
export class AuthService {

    token: string;

    constructor(private router: Router) {}

    signupUser(email: string, password: string) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(
                err => console.log(err)
            )
    }

    signInUser(email: string, password: string) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(
                response => {firebase.auth().currentUser.getIdToken().then(
                        (token: string) => {
                            this.token = token;
                        }
                    );
                    this.router.navigate(['/']);
                }
            )
            .catch(
                err => console.log(err)
            );
    }

    getToken() {
        firebase.auth().currentUser.getIdToken()
            .then(
                (token: string) => {
                    this.token = token;
                }
            )
            .catch(
                err => console.log(err)
            );
        return this.token;
    }

    isAuthenticated() {
        return this.token != null;
    }

    logout() {
        firebase.auth().signOut();
        this.token = null;
        this.router.navigate(['/']);
    }
}