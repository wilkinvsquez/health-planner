/** Libraries */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, sendEmailVerification, getAuth, GoogleAuthProvider,
  sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signInWithCredential
} from '@angular/fire/auth';
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
/** Interfaces */
import { User } from '../../interfaces/User';
import { Response } from '../../interfaces/Response';
/** Services */
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  user: any;

  constructor(private userService: UserService, private googleAuth: Auth) { }

  /**
   * The `newUser` function is an asynchronous method that creates a new user object with the provided user data.
   * @param user The `user` parameter in the `newUser` function seems to be an object containing user data.
   * @param google The `google` parameter in the `newUser` function seems to be a boolean value that determines whether the user is signing in with Google.
   * @returns The `newUser` function is returning a Promise. If the user is signing in with Google, the function will return a user object with the user's full name, email, and photo URL. If the user is not signing in with Google, the function will return a user object with the user's name, last name, email, and photo URL.
   */
  async newUser(user: any, google: boolean = false) {
    let fullName: any;
    if (google) {
      fullName = user.displayName!.split(' ');
    }
    const tempUser: User = {
      uid: user.uid,
      identification: '',
      name: google && fullName[0] ? fullName[0] : user.name,
      lastname: google && fullName.length > 1 ? fullName[1] : user.lastname,
      birthdate: '',
      email: user.email,
      phoneNumber: '',
      address: user.address ? user.address : '',
      lat: user.lat ? user.lat : 0,
      lng: user.lng ? user.lng : 0,
      photoURL: google ? user.photoURL : '',
      userRelations: [{ uid: '123' }],
      appointments: [],
      notes: [],
      role: 'user', // Assign role here
      active: true,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    return tempUser as User;
  }

  /**
   * Retrieves the current user from Firebase Authentication and Firestore based on the user's UID.
   * @returns A promise that resolves with the current user data if the user is logged in, or rejects with an error message if no user is logged in.
   */
  async getCurrentUser(): Promise<Response> {
    try {
      return new Promise((resolve, reject) => {
        this.auth.onAuthStateChanged(async (user) => {
          if (user) {
            const response: Response = await this.userService.searchUsers(user.uid) as Response;
            if (response.success) {
              const currentUser = response.data[0];
              this.currentUserSubject.next(currentUser as User);
              resolve(currentUser);
            }
            else {
              4
              reject(response.message);
            }

          } else {
            reject(null);
          }
        });
      });
    } catch (error) {
      return { success: false, data: error, message: 'Error' };
    }
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  // Método para verificar si el usuario es administrador
  isAdmin(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user ? user.role === 'admin' : false)
    );
  }

  /**
   * Registers a new user by creating a new user account with email and password authentication in Firebase Authentication,
   * and then saves additional user data to the Firestore database.
   * @param user An object containing the user data including email, password, and any additional information.
   * @returns A promise that resolves with an object containing a message indicating the success or failure of the registration,
   * and the user data saved in the database if registration is successful.
   */
  async register(user: any) {
    return await createUserWithEmailAndPassword(
      this.auth,
      user.email,
      user.password!
    )
      .then(async (res) => {
        const userData: User = await this.newUser({
          ...user,
          uid: res.user.uid,
        });
        const { password, ...userToSave } = userData;
        await sendEmailVerification(this.auth.currentUser!);
        await setDoc(doc(this.firestore, 'users', res.user.uid), userToSave);
        return { message: 'User logged successfully', user: userToSave };
      })
      .catch((error) => {
        return { message: 'Error signing in', error };
      });
  }

  /**
   * The function `signIn` asynchronously signs in a user with their email and password, returning a
   * success message and user data upon successful sign-in, or an error message upon failure.
   * @param {any} user - The `user` parameter in the `signIn` function seems to be an object containing
   * at least two properties: `email` and `password`. These properties are likely used to authenticate a
   * user during the sign-in process.
   * @returns The `signIn` function is returning a Promise. If the sign-in operation is successful, it
   * will return an object with a success message and the user object. If there is an error during
   * sign-in, it will return an object with an error message.
   */
  async signIn(user: any) {
    return await signInWithEmailAndPassword(
      this.auth,
      user.email,
      user.password
    )
      .then((res) => {
        this.getCurrentUser();
        return { message: 'Usuario registrado exitosamente', user: res.user };
      })
      .catch((error) => {
        return { message: 'Error al iniciar sesión', error };
      });
  }

  /**
   *  The `sendPasswordResetEmail` function is an asynchronous method that sends a password reset email to the user
   * @param email
   */
  async sendPasswordResetEmail(email: string): Promise<Response> {
    const auth = getAuth();
    return await sendPasswordResetEmail(auth, email)
      .then(() => {
        return { success: true, data: email, message: 'Password reset email sent successfully' }
      })
      .catch((error) => {
        return { success: false, data: error.code, message: error.message }
      });
  }

  /**
   * The function signInWithGoogleProvider signs in a user using Google authentication and registers the
   * user in a Firestore database if they are new.
   * @returns The `signInWithGoogleProvider` function returns a Promise. If the sign-in process is
   * successful and the user is registered successfully, it returns an object with a message stating
   * 'User registered successfully' and the user data. If the user already exists, it returns the
   * existing user data. If there is an error during the sign-in process, it returns an object with a
   * message stating 'Error signing in
   */
  async signInWithGoogleProvider(): Promise<Response> {
    try {
      const googleUser = await GoogleAuth.signIn();
      const _credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      const user = await signInWithCredential(this.googleAuth, _credential).then((res) => res.user);

      // Check if user exists in Firestore
      const response: Response = await this.userService.searchUsers(user.uid);
      console.log({ response });

      if (response.success && response.data.length === 0) {
        // If user does not exist, add user to Firestore
        // const user: any = { displayName: googleUser.name };
        const userData = await this.newUser(user, true);
        console.log({ userData });
        console.log({ user });

        await setDoc(doc(this.firestore, '/users', user.uid), userData);
        this.currentUserSubject.next(userData);
      } else {
        this.currentUserSubject.next(response.data[0] as User);
      }
      return { success: true, data: googleUser, message: 'User registered successfully' };
    } catch (error) {
      return { success: false, data: error, message: 'Error signing in' };
    }
  }

  // googleAuth

  // async signInWithGoogleProvider(): Promise<any> {
  //   const googleUser = await GoogleAuth.signIn();
  //   const _credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
  //   console.log('_credential', _credential);

  //   return signInWithCredential(this.googleAuth, _credential);
  // }

  /**
   * The `signOut` function is an asynchronous method that signs the user out by calling the `signOut`
   * method of the `auth` object.
   * @returns The `signOut` method is being returned as a promise.
   */
  async signOut(): Promise<Response> {
    return await this.auth.signOut().then(() => {
      this.currentUserSubject.next(null);
      return { success: true, data: null, message: 'User signed out successfully' };
    }).catch((error) => {
      return { success: false, data: error.code, message: error.message };
    });
  }

  /**
   * The function `deleteUserAccountt` asynchronously deletes the current user's account after retrieving
   * the user information.
   */
  async deleteUserAccount(userId: string) {
    try {
      const result = await this.http.delete(
        `${environment.functionsBaseUrl}/api/user/${userId}`,
      ).toPromise();
      return result;
    } catch (error) {
      console.error("Error deleting account:", error);
      return error;
    }
  }
}
