trigger LiveChatTranscriptEventTrigger on LiveChatTranscriptEvent (before insert,before update) {
    
 
    String reGexVisa = '(\\d[\\d -]{13,19}\\d)';   
    Pattern regexPattern = Pattern.compile(reGexVisa);  
    
    list<livechattranscript> livechattranscriptList = new list<livechattranscript>();
     list<id> newChatTranscript = new list<id>();
    for(LiveChatTranscriptEvent lcte: trigger.new){
           
             newChatTranscript.add(lcte.LiveChatTranscriptId );           
             
    } 
    
          for(livechattranscript chatlist: [select id, body from livechattranscript where id IN: newChatTranscript ]){
             String withOutSpec=(chatlist.body).replaceAll('[-, +]','');
            Matcher regexMatcher = regexPattern.matcher(withOutSpec);
          // Matcher regexMatcherSub = regexPattern.matcher(caseSubWithoutSpec); 
           
            system.debug('-------------group count----'+regexMatcher.groupCount());
            system.debug('to print regex: ' + regexMatcher);
            system.debug('to print regex: ' + regexPattern);
            
            while(regexMatcher.find()){
              Integer countGroup=0;
              String  matchValue=regexMatcher.group(countGroup);
                System.debug('Match Value---'+matchValue);
                
              chatlist.body = String.valueOf(chatlist.body).replaceAll(reGexVisa, 'XXXX-XXXX-XXXX-XXXX');
              countGroup++;         
            }          
            
             //chatlist.body = chatlist.body ; 
             system.debug('chatlist.body:'+ chatlist.body);       
  
             livechattranscriptList.add(chatlist);          
           }
           if(livechattranscriptList.size() > 0 ){
             system.debug('livechattranscriptList :'+livechattranscriptList);
             update livechattranscriptList;
           }
           
           
    
      /*String reGexVisa='.*(?:\\d[ -]?){13,19}.*';
    Pattern regexPattern = Pattern.compile(reGexVisa);
        for(case cs : newList){
           String withOutSpec=(cs.Description).replaceAll('[-, +]','');
           Matcher regexMatcher = regexPattern.matcher(withOutSpec);
            system.debug('-------------group count----'+regexMatcher.groupCount());
            system.debug('to print regex: ' + regexMatcher);
            system.debug('to print regex: ' + regexPattern);
            while(regexMatcher.find()){
              Integer countGroup=0;
              String  matchValue=regexMatcher.group(countGroup);
              cs.Description= String.valueOf(cs.Description).replaceAll('[0-9]', 'X');
              countGroup++;
         
                
            }*/
    

}