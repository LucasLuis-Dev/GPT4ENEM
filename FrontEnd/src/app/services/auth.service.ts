import { Injectable } from '@angular/core';
import { error } from 'console';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private auth = getAuth();
  private googleProvider = new GoogleAuthProvider();
  private microsoftProvider = new OAuthProvider('microsoft.com');
  private facebookProvider = new FacebookAuthProvider()


  constructor() { }

  createUserWithEmailAndPasswordForms(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          environment.USER = user
        })
        .catch((error) => {
          throw error;
        });
  }

  signInWithEmailAndPasswordForms(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        environment.USER = user
        if (user.email && user.uid) {
          environment.USER_PHOTO_URL = '../../../assets/images/user-icon.svg'
          environment.USER_EMAIL = user.email
          environment.USER_UID = user.uid
          const emailParts = user.email.split('@');
          environment.USER_NAME = emailParts[0];
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        throw error;
      });
  }

  signInWithGoogle(): Promise<void> {
    return signInWithPopup(this.auth, this.googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
        }
        const user = result.user;
        environment.USER = user
        if (user.photoURL && user.displayName && user.email && user.uid) {
          environment.USER_PHOTO_URL = user.photoURL
          environment.USER_NAME = user.displayName
          environment.USER_EMAIL = user.email
          environment.USER_UID = user.uid
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }


  setPersistenceAndSignIn(email: string, password: string): Promise<void> {
    return setPersistence(this.auth, browserSessionPersistence)
      .then(() => {
        return this.signInWithEmailAndPasswordForms(email, password);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  

  signOutUser(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        environment.USER = {}
      })
      .catch((error) => {
        
      });
  }
  
}