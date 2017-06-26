import {Injectable} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
//import rxjs
import { Observable} from 'rxjs/Observable';

/*
    NOTES: The purpose of this service is to help us retrieve user info,such as
    user id, username..etc. This can be injected into any component that requires
    user info.
*/
@Injectable()
export class UserInfoService
{
    constructor(private firebase:AngularFireAuth,
    private firebaseDatabase:AngularFireDatabase)
    {

    }

    getUserId():string //returns logged in users id.
    {
       return this.firebase.auth.currentUser.uid;
    }

    getUserEmail() //returns logged in users email.
    {
        return this.firebase.auth.currentUser.email;
    }

    // getUserNameOfLoggedInUser():Observable<string> //get logged in users username.
    // {
    //     return this.firebaseDatabase.object("/users/"+this.getUserId()+"/username").map((username)=>
    //     {
    //         return username.$value;
    //     });
    // }

    getUserNameById(idOfUser:string):Observable<string> //get any users username provided an id
    {
        return this.firebaseDatabase.object("/users/"+idOfUser+"/username").
        map((username)=>
        {
            return username.$value;
        });
    }

    getUser():Observable<any> // returns the whole user object from db.
    {
        return this.firebaseDatabase.object("/users/"+this.getUserId()).map((user)=>
        {
            return user;
        });
    }


}