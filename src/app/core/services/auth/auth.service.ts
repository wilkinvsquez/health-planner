import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  constructor() {}

  /**
   * Registers a new user by creating a new user account with email and password authentication in Firebase Authentication,
   * and then saves additional user data to the Firestore database.
   *
   * @param user An object containing the user data including email, password, and any additional information.
   * @returns A promise that resolves with an object containing a message indicating the success or failure of the registration,
   * and the user data saved in the database if registration is successful.
   */
  async register(user: any) {
    return await createUserWithEmailAndPassword(
      this.auth,
      user.email,
      user.password
    )
      .then(async (res) => {
        console.log(res);
        const userData = { ...user, uid: res.user.uid };
        const { password, ...userToSave } = userData;
        await addDoc(collection(this.firestore, 'users'), userToSave);
        return { message: 'User registered successfully', user: userToSave };
      })
      .catch((error) => {
        return { message: 'Error registering user', error };
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
    console.log(user.email, user.password);
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
   * The `signOut` function is an asynchronous method that signs the user out by calling the `signOut`
   * method of the `auth` object.
   * @returns The `signOut` method is being returned as a promise.
   */
  async signOut() {
    return await this.auth.signOut();
  }

  //async deleteUser(id: string) {
  //  return await this.auth.
  //}
}
