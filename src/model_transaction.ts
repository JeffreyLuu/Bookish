export default class Transaction {
    name: string;
    due_date: any;
    constructor(name, due_date) {
        this.name = name;
        this.due_date = due_date;
    }
}
