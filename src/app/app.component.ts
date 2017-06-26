import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
//import necessary services
import {AuthenticationService} from "../services/AuthenticationService";

//import necessary components
import {SignInComponent} from "../pages/signIn/SignInComponent";
import {SignUpComponent} from "../pages/signUp/SignUpComponent";
import {ChatsComponent} from '../pages/chats/ChatsComponent';
import {UserProfileComponent} from "../pages/userProfile/UserProfileComponent";
@Component({
  templateUrl: 'app.html'
})
export class MyApp 
{
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SignInComponent;

  pages: Array<{title: string, component: any}>;

  constructor(private alertController:AlertController,private network:Network,private authenticationService:AuthenticationService, 
  public platform: Platform, public statusBar: StatusBar, 
  public splashScreen: SplashScreen) 
  {
    this.initializeApp();
    this.pages = 
    [
      {title:"Sign In", component:this.rootPage},
      {title:"Profile", component:UserProfileComponent},
      {title: "Chats", component:ChatsComponent},
    ];
  }

  initializeApp() 
  {
    this.platform.ready().then(() => 
    {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout()
  {
    this.authenticationService.logout();
    this.nav.setRoot(this.rootPage);
  }
  openPage(page) 
  {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
     this.nav.setRoot(page.component);
    // this.nav.push(page.component);
  }
}
