export class Patient {
  idPatient: number;
  firstName: string;
  lastName: string;
  dni: string;
  address: string;
  phone: string;
  email: string;

  constructor(
    idPatient: number,
    firstName: string,
    lastName: string,
    dni: string,
    address: string,
    phone: string,
    email: string
  ) {
    this.idPatient = idPatient;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dni = dni;
    this.address = address;
    this.phone = phone;
    this.email = email;
  }
}
