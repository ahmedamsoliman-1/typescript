export class Message{
    title: string;
    message: string;
    iaSent: boolean;

    constructor(title: string, message: string) {
        this.title = title;
        this.message = message;
        this.iaSent = false;
    }
}


const message = new Message('Hello', 'World');