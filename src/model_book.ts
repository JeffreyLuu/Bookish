export default class Book {
    id: number
    name: string
    author: string
    ISBN: number
    constructor(id, name, author, ISBN) {
        this.id  = id;
        this.name = name;
        this.author = author;
        this.ISBN = ISBN
    }
}
