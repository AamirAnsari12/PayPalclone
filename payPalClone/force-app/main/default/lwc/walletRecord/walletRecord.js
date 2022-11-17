import { LightningElement } from 'lwc';

export default class WalletRecord extends LightningElement {

    recordId;

    successHandler(event){
        this.recordId=event.detail.Id;

    }
}