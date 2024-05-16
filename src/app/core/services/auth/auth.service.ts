import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
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
        const userData = { ...user, uid: res.user.uid };
        const { password, ...userToSave } = userData;
        await addDoc(collection(this.firestore, 'users'), userToSave);
        return { message: 'User registered successfully', user: userToSave };
      })
      .catch((error) => {
        return { message: 'Error registering user', error };
      });
  }

  //async deleteUser(id: string) {
  //  return await this.auth.
  //}
}
