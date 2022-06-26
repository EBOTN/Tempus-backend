export class userDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
  }
}
