({
    init : function (cmp) {
        var search = location.search.substring(1);
        console.log('search===='+search);
var vars = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })


      var flow = cmp.find("flowData");
      var flowName = cmp.get("v.flowName");
      var chatnumber = cmp.get("v.chatNumber");
      var language = cmp.get("v.language");
      var inputVariables = [];

     delete vars.flowName;
     delete vars.language;

      
      var ikeys = Object.keys(vars);
      for(var key of ikeys){
        var uvalue = vars[key].replace(/\+/g, ' ')
        console.log(uvalue);

       // console.log(key, vars[key]);
        inputVariables.push({
          name : key,
          type : 'String',
          value : uvalue
        }
       
        );
      }

      console.log('inputVariables===='+JSON.stringify(inputVariables));
      
      flow.startFlow(flowName, inputVariables);
    },
  
    handleStatusChange : function (cmp, event) {
      if (event.getParam('status') === "FINISHED") {
         var outputVariables = event.getParam("outputVariables");
        if (!outputVariables)
        {
          outputVariables = 'Flow Complete';
        }
          
        var myData = JSON.parse(JSON.stringify(outputVariables));

        console.log('mydata===='+myData);
     
        var array = [];
        let creditinfo ='';
        for(var i in myData)
        {
          var Label=myData[i].name;
          var value=myData[i].value;
          
          //console.log('Label===='+Label);
          //console.log('value===='+value);
          creditinfo += Label+ " : " +value + '\n';

          /*var cLabel= '$Label.c.';
          // cLabel =  'c.';
           cLabel += ''+Label;

         console.log('++++:' +cLabel);         
          array.push('\n' + $A.getReference(cLabel) + ': '+value);  */       
         
        }        
        console.log('***' +creditinfo);      
        
        let successMsg = 'Credit card detail has been shared';
        
       // console.log('output' +output);
      //  window.parent.postMessage({message: 'lwc:hide:' + array, type: 'flow.finished' },'*');
      window.parent.postMessage({message: 'lwc:hide:'+successMsg, type: 'flow.finished' },'https://dell-c5-dev-ed--c.visualforce.com');
      
      //Do something
      }
    },
    handleRouteChange : function(component, event, helper) {
     //   console.log(event);
    }
  });