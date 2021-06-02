import BaseChatMessage from 'lightningsnapin/baseChatMessage';
import { LightningElement, track,api,wire } from 'lwc';

import { getRecord} from 'lightning/uiRecordApi';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import CustomURL from '@salesforce/label/c.CustomURL';
import CustomCreditCard from '@salesforce/label/c.CreditCardNumber';
import CustomCVV from '@salesforce/label/c.CVVnumber';
import CustomExpiry from '@salesforce/label/c.expirydate';
import IsSecureInfoShared from '@salesforce/apex/SecureInfo.IsSecureInfoShared';


const CHAT_CONTENT_CLASS = 'chat-content';
const AGENT_USER_TYPE = 'agent';
const CHASITOR_USER_TYPE = 'chasitor';
const SUPPORTED_USER_TYPES = [AGENT_USER_TYPE, CHASITOR_USER_TYPE];

export default class Lwcchatpack extends BaseChatMessage
   
{  
    @api recordId;
   // @wire(getRecord, { recordId: '$recordId', fields: "language" })
    @track strMessage = '';
    @track chatkey = '';
    @track sfdcBaseURL = '';
    @track isFrameDisplay = [];

    //Add a var to track visibility for the component
       @track flow = false;
    
     label = {
        CustomURL
    };
     

    @wire(IsSecureInfoShared, { recordId: '$recordId' })
    displayIframe(result) {
        this.isFrameDisplay = result;
        console.log('deisplayIframe => ', result.data, result.error);
        if (result.data) {
            
            console.log('this.recordId'+this.recordId);
            console.log('this.recordId'+result.data);
        } else if (result.error) {
            console.error('ERROR => ', JSON.stringify(result.error)); // handle error properly
        }
    }

    connectedCallback() 
    { 
        console.log('CustomURL:'+CustomURL);
        //Set message string
        this.strMessage = this.messageContent.value;
      //  this.sfdcBaseURL = window.location.origin;
       // console.log('strMessage'+window.location.pathname);
        
      /*  document.onkeydown = function (e) {  
          return (e.which || e.keyCode) != 116;  
        }; */
        if (this.isSupportedUserType(this.userType)) 
        {
            

            if (this.userType == 'agent' && this.messageContent.value.startsWith('lwc:flow') )
            {
                this.chatkey = this.messageContent.value.split(':')[5];
                console.log('chatkey===='+this.chatkey );
                IsSecureInfoShared({strChatNumber :  this.chatkey })
                .then(result =>{
                   console.log('chat result av76876ailable=='+result);
                   if(result == false)
                   {
                       
                        this.flow = true;
                        console.log('in side if');

                   }
                })
                .catch(error =>{
                                    console.log('error==',error);
                                    console.log('error occured');
                }) 
                            
                //counter++;
            }          
        
            //ELSE SHOW BASE CHAT MESSAGE
            else if (!this.messageContent.value.startsWith('lwc:hide'))
            {
                this.isBaseTextVisible = true;
                this.messageStyle = `${CHAT_CONTENT_CLASS} ${this.userType}`;
            }
        } 
        else
        {
            throw new Error('Unsupported user type passed in: ${this.userType}');
        }
    }


    isSupportedUserType(userType) 
    {
        return SUPPORTED_USER_TYPES.some((supportedUserType) => supportedUserType === userType);
    }

    handlePostMessage(event) 


    {
        const dateValue = event.detail;
        console.log('Handling Event with value: ' + dateValue);
        window.postMessage(
            {
                message: dateValue,
                type: "chasitor.sendMessage"
            },
            window.parent.location.href
        );
    }
}