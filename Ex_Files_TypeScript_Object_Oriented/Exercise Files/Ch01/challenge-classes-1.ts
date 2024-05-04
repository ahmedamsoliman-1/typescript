/**
 * -----------------------------
 * Challenge 1: Classes
 * -----------------------------
 * 1. Create a User class.
 * 2. Add a firstName, lastName, and email property.
 * 3. Add a get to return fullName.
 * 4. Add a method to check if your email param matches the user's current email.
 */

class User {
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;

    constructor(firstName: string, lastName: string, email: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.fullName = `${firstName} ${lastName}`;
    }

    checkEmail(email: string): boolean {
        return this.email === email;
    }
}

const user_1 = new User('John', 'Doe', 'XXXXXXXXXXXX');
user_1.checkEmail('XXXXXXXXXXXX');