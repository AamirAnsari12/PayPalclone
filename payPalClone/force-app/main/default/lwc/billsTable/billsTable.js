import { LightningElement,api, wire} from 'lwc';
import {updateRecord} from 'lightning/uiRecordApi';
import getBills from '@salesforce/apex/billRecord.getBill';
import wallcheck from '@salesforce/apex/walletController.walletCheck';
import { NavigationMixin } from 'lightning/navigation';
import Paid from '@salesforce/schema/bills__c.paid__c';
import bId from '@salesforce/schema/bills__c.Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
{ label: 'Bill Id', fieldName: 'Name' },
{ label: 'Bill Amount', fieldName: 'bill_amount__c' },
{ label: 'Due Date', fieldName: 'pay_before__c' },

{ type: "button", typeAttributes: {
label: 'Pay Bill',
name: 'Pay',
title: 'Pay',
disabled: false,
value: 'Pay',
iconPosition: 'left'
} },
{ type: "button", typeAttributes: {
label: 'View',
name: 'View',
title: 'View',
disabled: false,
value: 'View',
iconPosition: 'left'
} }
];

export default class DatatableBillObj extends
NavigationMixin(LightningElement) {
bills;
error;
columns = COLUMNS;

handleKeyChange( event ) {
const searchKey = event.target.value;
if ( searchKey ) {
getBills( { searchKey } )
.then(result => {
this.bills = result;
})
.catch(error => {
this.error = error;
});
} else
this.bills = undefined;
}
listwall;

callRowAction( event ) {

const recId = event.detail.row.Id;
const actionName = event.detail.action.name;
const username = event.detail.row.customer__c;
const balancebill = event.detail.row.bill_amount__c;

if ( actionName === 'Pay' ) {

wallcheck({user:username}).then((data)=>{console.log(data);this.listwall=data}).catch((error)=>{console.log(error)})

const userwall = this.listwall.Standard_User__c;
const balance = this.listwall.balance__c;
const wId = this.listwall.Id;

if(username==userwall){
if(balance>=balancebill){
const fields ={};
fields[bId.fieldApiName] = recId;
fields[Paid.fieldApiName]=true;
const recordInput={ fields }
updateRecord(recordInput)
.then((data)=>{console.log(data)})
.catch((error)=>{console.log(error)})
const event = new ShowToastEvent({
title: 'Bill Status',
message: 'Paid Successfuly',
variant: 'success',
mode: 'dismissable'
});

this.dispatchEvent(event);
this[NavigationMixin.Navigate]({
type: 'standard__recordPage',
attributes: {
recordId: recId,
objectApiName: 'bills__c',
actionName: 'view'
}
})
}
else{
this[NavigationMixin.Navigate]({
type: 'standard__recordPage',
attributes: {
recordId: wId,
objectApiName: 'wallet__c',
actionName: 'view'
}
})
const event = new ShowToastEvent({
title: 'Bill Status',
message: 'Not Enought Balance',
variant: 'error',
mode: 'dismissable'
});
this.dispatchEvent(event);
}
};
}
else if ( actionName === 'View') {
this[NavigationMixin.Navigate]({
type: 'standard__recordPage',
attributes: {
recordId: recId,
objectApiName: 'bills__c',
actionName: 'view'
}
})
}
}
}
