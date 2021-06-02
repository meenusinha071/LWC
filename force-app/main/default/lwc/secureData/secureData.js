import { LightningElement , api, wire, track} from 'lwc';
import { getRecord , getFieldValue,getRecordNotifyChange  } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import SecureInfo from '@salesforce/schema/LivechatTranscript.Credit_Card_Info__c';
import getChatRecord from '@salesforce/apex/SecureInfo.getChatRecord'
import removeCCinfo from '@salesforce/apex/SecureInfo.removeCCinfo'

//const fields = [SecureInfo];
export default class SecureData extends LightningElement {
    @api recordId;
    @track chatTranscipt ;
    @track CCInformation = 'Test';
    @track isshowInfo = false;
    @track wiredChatList = [];
    @track ccNumber ;
    @track cvv;
    @track exp_date;
    @track intCounter ;
     showtimer = false;

    @wire(getRecord, { recordId: '$recordId', fields: ['LivechatTranscript.Credit_Card_Info__c'] })
    getChatRecord(result) {
        this.wiredChatList = result;
        console.log('chatrecord => ', result.data, result.error);
        if (result.data) {
            this.chatTranscipt = result.data;
            console.log('this.chatTranscipt.fields==='+this.chatTranscipt.fields.Credit_Card_Info__c.value)
            if(this.chatTranscipt.fields.Credit_Card_Info__c.value != null)
            {
                var res = this.chatTranscipt.fields.Credit_Card_Info__c.value.split(";");
                this.ccNumber = res[0].split(":")[1];
                this.cvv = res[1].split(":")[1];
                this.exp_date = res[2].split(":")[1];
            }
            else
            {
                this.ccNumber ='';
                this.cvv = '';
                this.exp_date = '';
            }
            
        } else if (result.error) {
            console.error('ERROR => ', JSON.stringify(result.error)); // handle error properly
        }
    }

    processRelatedObjects() {
        //console.log('processRelatedObjects for => ', JSON.stringify(this.chatTranscipt));
        // further processing like refreshApex or calling another wire service
       //return refreshApex(this.chatTranscipt);
    }

    /*  @wire(getChatRec)
    chatTranscipt1;*/

   get ccinfo() {

      // console.log('this.chatTranscipt.Test__c===='+this.CCInformation);
        return this.chatTranscipt.fields.Credit_Card_Info__c.value;
    }

    get ccNumber()
    {
        return this.ccnumber;
    }
    get cvv(){
        return this.cvv;
    }
    get expDate()
    {
        return this.exp_date;
    }

    get isshowTimer()
    {
        return this.showtimer;
    }
   

    handleClick(event)
    {
        
        console.log('this.wiredChatList===='+this.chatTranscipt.fields.Credit_Card_Info__c.value);
        refreshApex(this.wiredChatList);
       // if(this.chatTranscipt.fields.Credit_Card_Info__c.value != null)
       // this.startCounter();
    }

    connectedCallback()
    {
       
    }

    renderedCallback(event)
    {
       
    }

    startCounter()
    {
        
        
        let counter = 0;
        const intervalId = setInterval(() => {
        console.log('Hello World');

        counter += 1;
        this.intCounter = counter;
        console.log('this.intCounter==='+ this.intCounter);
        console.log('ddcounter==',this.template.querySelector('.counter'));
        let z = 60-this.intCounter;
        this.template.querySelector('.counter').innerHTML = 'Please fill the details in '+z + ' second.';
        this.template.querySelector('.timer').style.display = 'block';

        if (counter === 60) {
            console.log('Done');
            clearInterval(intervalId);
            this.template.querySelector('.timer').style.display = 'none';
            this.showTimer = false;
            this.updateCCinfo();
        }
        }, 1000);
       
       // this.intCounter = counter;

    }

    updateCCinfo()
    {
       
        removeCCinfo({ recordId: this.recordId })
        .then((result) => {
            console.log('this.recordId==='+this.recordId);
            refreshApex(this.wiredChatList);
        })
        .catch((error) => {
            
        });
    }
}