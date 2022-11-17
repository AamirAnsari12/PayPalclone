import {LightningElement, track, wire} from 'lwc';
import fetchRecords from "@salesforce/apex/PDFGenerateCtrl.fetchRecords";
import sendPdf from "@salesforce/apex/PDFGenerateCtrl.sendPdf";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class GeneratePdfAndSendEmail extends LightningElement {
    @track l_All_Types;
    @track typeOptions;
    @track selectedOption;
 
    @wire(fetchRecords, {})
    wireData({error, data}) {
        if (data) {
            try {
                console.log(data);
                this.l_All_Types = data; 
                let options = [];
                  
                for (var key in data) {
                    // Here key will have index of list of records starting from 0,1,2,....
                    options.push({label: data[key].Name, value: data[key].Id });
                }
                this.typeOptions = options; 
            } catch (error) {
                console.error('check error here', error);
            }
        } else if (error) {
            console.error('check error here', error);
        }
    }
  
    handleTypeChange(event){
        this.selectedOption = event.target.value; 
    }
 
    generatePDF(){
        sendPdf({passId : this.selectedOption})
        .then(res=>{
            this.ShowToast('Success', res, 'success', 'dismissable');
        })
        .catch(error=>{
            this.ShowToast('Error', 'Error in send email!!', 'error', 'dismissable');
        })
    }
     
 
    ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
            title: title,
            message:message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
}