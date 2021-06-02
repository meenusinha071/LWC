import { LightningElement, api, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class Lwcchatpack_flow extends LightningElement
{
    @api inputParams;
    @track flowname = '';
    @track fullURL = '';
    @track flowheight = '200';
    @track blReplied = false;
    @track language = 'en_US';
    @api sourceUrl;
    @api chatnumber ; 

    handleFinish(event)
    {
        console.log('inside handle event' ,event.data.type);
       // console.log('received response data:  ',event.data); 
     //   console.log('received response message:  ',event.data.message); 
     //   console.log('received response origin:  ',event.origin); 
        if (event.data && event.data.type === 'flow.finished' && !this.blReplied /* && event.origin=='https://creditcardinfo-developer-edition.ap24.force.com'*/)
        {
            //alert('data:' + event.data.message);
            this.blReplied = true;
            this.dispatchEvent(new CustomEvent('postmessage',{detail: event.data.message}));
        }
    }

    
    connectedCallback()
    {
        this.conts = this.inputParams.split(':')[2];
        if (this.inputParams.split(':').length > 3)
        {   
            this.flowname= this.inputParams.split(':')[2];
            this.flowheight = this.inputParams.split(':')[3];
            if(this.inputParams.split(':')[4] != 'undefined'){
               this.language = this.inputParams.split(':')[4];
            }else{
                this.language = 'en_US';
            }
            this.chatnumber = this.inputParams.split(':')[5];
        }

        console.log('2:'+this.inputParams.split(':')[2] );
        console.log('3:'+this.inputParams.split(':')[3] );
        console.log('4:language'+this.language );
        console.log('5:'+this.chatnumber );
         
        this.sourceUrl = 'https://dell-c5-dev-ed--c.visualforce.com/apex/FlowPage?language='+this.language+'&flowName=capture_credit_card_details&ChatNumber='+this.chatnumber;
      //  this.sourceUrl = this.sourceUrl+'/flowcomponent/s/flowcomponent?language='+this.language+'&flowName='+this.flowname;
        console.log('sourceURL:'+this.sourceUrl );
        /*  https://creditcardinfo-developer-edition.ap24.force.com/flowcomponent/s/flowcomponent?language=de&flowName=capture_credit_card_details
         this.flowurl = unescape(this.conts).replace(/&amp;/g, '&');
        console.log(this.flowurl);

       let commURL = window.location.pathname.split('/')[1];
        if(commURL === 's'){
            commURL = '';
        } else {
            commURL = '/' + commURL;
        }
      //  this.flowname =   commURL + 's/flowcomponent?flowName=' + this.flowurl; */

      this.fullURL = this.sourceUrl;
        console.log(this.flowname);
        
        
        //Try to handle a post from the flow finishing
        window.addEventListener('message', this.handleFinish.bind(this));


    }

    disconnectedCallback() 
    {
        window.removeEventListener('message', this.handleFinish.bind(this));
    }
}