export class userDTO{

    id;
    email;
    name;
    secondname;
    
    constructor(model){
        this.id = model.id
        this.email = model.email
        this.name = model.name
        this.secondname = model.secondName
    }
}