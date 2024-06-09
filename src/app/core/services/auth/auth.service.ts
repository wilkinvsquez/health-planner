import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
} from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

import {
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

import { User } from '../../interfaces/User';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  user: any;

  constructor(private userService: UserService) { }

  /**
   * Retrieves the current user from Firebase Authentication and Firestore based on the user's UID.
   *
   * @returns A promise that resolves with the current user data if the user is logged in, or rejects with an error message if no user is logged in.
   */
  async getCurrentUser() {
    try {
      this.user = new Promise((resolve, reject) => {
        this.auth.onAuthStateChanged(async (user) => {
          if (user) {
            const res = await this.userService.searchUsers(user.uid);
            resolve(res[0]);
          } else {
            reject('No user logged in');
          }
        });
      });
      return this.user;
    } catch (error) {
      console.error('Error getting user:', error);
    }
  }

  /**
   * Registers a new user by creating a new user account with email and password authentication in Firebase Authentication,
   * and then saves additional user data to the Firestore database.
   *
   * @param user An object containing the user data including email, password, and any additional information.
   * @returns A promise that resolves with an object containing a message indicating the success or failure of the registration,
   * and the user data saved in the database if registration is successful.
   */
  async register(user: User) {
    return await createUserWithEmailAndPassword(
      this.auth,
      user.email,
      user.password!
    )
      .then(async (res) => {
        const userData = { ...user, uid: res.user.uid };
        const { password, ...userToSave } = userData;
        await sendEmailVerification(this.auth.currentUser!);
        await addDoc(collection(this.firestore, 'users'), userToSave);
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
  async sendPasswordResetEmail(email: string) {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        return {
          message: 'Password reset email sent successfully',
          email: email,
        };
      })
      .catch((error) => {
        return { message: 'Error sending password reset email', error };
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
  async signInWithGoogleProvider(): Promise<any> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      console.log(user);
      const userExists = await this.userService.searchUsers(user.uid);

      if (userExists.length === 0) {
        const fullName = user.displayName!.split(' ');
        const userData = {
          uid: user.uid,
          identification: '',
          email: user.email,
          name: fullName[0],
          lastname: fullName.length > 1 ? fullName[1] : '',
          photoURL: user.photoURL,
        };

        await addDoc(collection(this.firestore, 'users'), userData).then(() => {
          return { message: 'User registered successfully', user: userData };
        });
      }

      return await this.userService.getUserById(user.uid);
    } catch (error) {
      return { message: 'Error signing in with Google', error };
    }
  }

  /**
   * The `signOut` function is an asynchronous method that signs the user out by calling the `signOut`
   * method of the `auth` object.
   * @returns The `signOut` method is being returned as a promise.
   */
  async signOut() {
    return await this.auth.signOut();
  }

/**
 * The function `deleteUserAccountt` asynchronously deletes the current user's account after retrieving
 * the user information.
 */
  async deleteUserAccountt() {
    await this.getCurrentUser().then(async (user) => {
      try {
        await deleteUser(user);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    })
  }
}
