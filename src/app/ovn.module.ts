import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OHCore } from './ohCore/oh.module';

import { OVNRouting } from './ovn.route';
import { OHService } from './tis.ohService';
import { CoreService } from './ind.coreService';

import { OVNLogin, OVNPasswordConfirm, OVNPasswordRestore, OVNRegister } from './access/view/ovn.core';
import { OVNBody } from './view/body/ovn.body';
import { OVNFoot } from './view/foot/ovn.foot';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';
import { Messaging } from './ind.messaging';
import { AsyncPipe } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@NgModule({
  declarations: [
    OVNBody, OVNFoot, OVNLogin, OVNPasswordConfirm, OVNPasswordRestore, OVNRegister
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    OVNRouting,
    OHCore
  ],
  providers: [OHService, CoreService, Messaging, AsyncPipe],
  bootstrap: [OVNBody]
})
export class OVNModule { }