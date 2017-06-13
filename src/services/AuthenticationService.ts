import {Injectable} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
//import rxjs
import { Observable} from 'rxjs/Observable';
/*
    ABOUT: just a class used for firebase authentication. We inject this into the 
    constructor of other components.
*/

// if(isUsernameUnique)
                // {
                //     //console.log(isUsernameUnique);
                //     let id = newUser.uid;
                //     this.firebaseDatabase.object("/users/"+id).
                //     set({username:usersname,email:userEmail});
                // }
@Injectable()
export class AuthenticationService
{
    constructor(private firebase:AngularFireAuth,
    private firebaseDatabase:AngularFireDatabase)
    {
    }

    addUserInfoToDatabase(userEmail:string,usersName:string,userPassword:string):firebase.Promise<any>
    {
        return this.firebase.auth.createUserWithEmailAndPassword(userEmail,userPassword).
        then((newUser)=>
        {
            let id = newUser.uid;
            this.firebaseDatabase.object("/users/"+id).set({email:userEmail,username:usersName});
            this.firebaseDatabase.object("/alreadyTakenUsernames/"+usersName).set(true);
            return true;
        }).catch((error:Error)=>{return error;});
    }

    checkUsername(name:string)
    {

        return this.firebaseDatabase.list("/alreadyTakenUsernames",
        {
            query:{orderByKey:true,limitToFirst:1,equalTo:name}
        }).
        map((feedback)=>
        {
            console.log("check username");
            return (feedback.length == 0)?(true):(false);
        });
    }

    isUserSignedIn():boolean
    {
        return this.firebase.auth.currentUser != null;
    }

    getUserId():string //returns logged in users id.
    {
       return this.firebase.auth.currentUser.uid;
    }

    getUser():Observable<any>
    {
        return this.firebaseDatabase.object("/users/"+this.getUserId()).map((user)=>
        {
            return user;
        });
        
    }

    login(email:string,password:string):firebase.Promise<any>
    {
        return this.firebase.auth.signInWithEmailAndPassword(email,password).
        then((feedback) => {return true;}).
        catch((error:Error) => {return error;});
    }

    logout()
    {
        this.firebase.auth.signOut();
    }
}